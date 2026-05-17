import { groqClient, MODELS } from "@/lib/groq"
import { withGroqRetry } from "@/lib/groq-errors"
import {
  ATS_KEYWORDS,
  MODE_KEYWORD_BOOST,
} from "@/lib/rewrite-constants"
import type { ProfileData, RewriteMode, RewriteResult, RewriteSection } from "@/types"

const ROLE_PATTERN =
  /\b(software engineer|product manager|data scientist|developer|designer|analyst|architect|devops|sre|frontend|backend|full[- ]?stack|ml engineer|intern)\b/i

const MODE_PROMPTS: Record<RewriteMode, string> = {
  startup:
    "You are a startup founder who hires. Rewrite this LinkedIn {section} to appeal to fast-moving startups and scale-ups. Emphasise: ownership, impact, technical depth, builder mindset, speed of execution. Avoid corporate jargon. Be direct, specific, confident.",
  faang:
    "You are a senior recruiter at Google/Meta/Amazon. Rewrite this LinkedIn {section} to pass FAANG screening. Emphasise: scale, metrics, algorithmic thinking, system design awareness, leadership principles alignment. Include strong action verbs and measurable impact numbers.",
  recruiter:
    "You are a technical recruiter. Rewrite this LinkedIn {section} to maximise recruiter attention in the first 6 seconds. Emphasise: clear role identity, relevant keywords, specific accomplishments. Remove all generic phrases. Make it ATS-friendly and human-compelling.",
  internship:
    "You are a campus recruiter for top tech companies. Rewrite this LinkedIn {section} for a student/new grad seeking their first or second internship. Emphasise: relevant coursework, projects, skills, eagerness to learn. Be honest about seniority level while still being compelling.",
}

type GroqRewriteResponse = {
  rewritten: string
  improvements: string[]
  keywords: string[]
}

export function buildKeywordContext(
  profile: ProfileData,
  mode: RewriteMode,
  section: RewriteSection
): string[] {
  const keywords = new Set<string>()

  for (const skill of profile.skills.slice(0, 15)) {
    if (skill.trim()) keywords.add(skill.trim().toLowerCase())
  }

  const roleMatch = profile.headline.match(ROLE_PATTERN)
  if (roleMatch) keywords.add(roleMatch[0].toLowerCase())

  for (const kw of MODE_KEYWORD_BOOST[mode]) {
    keywords.add(kw.toLowerCase())
  }

  if (mode === "recruiter") {
    for (const kw of ATS_KEYWORDS.slice(0, 20)) {
      keywords.add(kw)
    }
  }

  if (section === "about" && profile.experience[0]) {
    const top = profile.experience[0]
    if (top.title) keywords.add(top.title.toLowerCase())
    for (const tech of extractTechFromText(top.description)) {
      keywords.add(tech)
    }
  }

  return [...keywords].slice(0, 25)
}

export async function rewriteSection(
  section: RewriteSection,
  original: string,
  profile: ProfileData,
  mode: RewriteMode
): Promise<RewriteResult> {
  const keywordContext = buildKeywordContext(profile, mode, section)
  const systemPrompt = buildSystemPrompt(section, mode)
  const userPrompt = buildUserPrompt(section, original, profile, mode, keywordContext)

  const completion = await withGroqRetry(() =>
    groqClient.chat.completions.create({
      model: MODELS.primary,
      temperature: 0.6,
      max_tokens: section === "headline" ? 400 : 1200,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    })
  )

  const content = completion.choices[0]?.message?.content
  if (!content) throw new Error("Empty rewrite response from Groq")

  const parsed = parseRewriteResponse(content)
  let rewritten = parsed.rewritten.trim()

  if (section === "headline" && rewritten.length > 120) {
    rewritten = rewritten.slice(0, 117).trimEnd() + "..."
  }

  const mergedKeywords = mergeKeywords(parsed.keywords, keywordContext, rewritten)

  return {
    original,
    rewritten,
    mode,
    improvements: ensureThreeItems(parsed.improvements),
    keywords: mergedKeywords,
  }
}

function buildSystemPrompt(section: RewriteSection, mode: RewriteMode): string {
  const base = MODE_PROMPTS[mode].replace("{section}", section)
  const constraints =
    section === "headline"
      ? "\n\nFor HEADLINE: maximum 120 characters. Output JSON only."
      : "\n\nFor ABOUT: 150-250 words in professional paragraphs. Output JSON only."

  return `${base}${constraints}

Return JSON only with this exact structure:
{
  "rewritten": "the rewritten text",
  "improvements": ["what changed and why 1", "item 2", "item 3"],
  "keywords": ["ats keyword 1", "keyword 2"]
}`
}

function buildUserPrompt(
  section: RewriteSection,
  original: string,
  profile: ProfileData,
  mode: RewriteMode,
  keywordContext: string[]
): string {
  return `Rewrite the ${section} below.

ORIGINAL ${section.toUpperCase()}:
${original || "(empty)"}

PROFILE CONTEXT:
Name: ${profile.contactInfo.name}
Current headline: ${profile.headline}
Skills: ${profile.skills.slice(0, 20).join(", ")}
Top experience: ${profile.experience[0]?.title ?? "N/A"} at ${profile.experience[0]?.company ?? "N/A"}
Projects: ${profile.projects.slice(0, 3).map((p) => p.name).join(", ")}

REWRITE MODE: ${mode}

KEYWORDS TO WEAVE IN (use naturally, not all required):
${keywordContext.join(", ")}

Remove generic phrases like "passionate about", "team player", "seeking opportunities".
${
  section === "headline"
    ? "Output ONLY the headline in the rewritten field — max 120 characters."
    : "Write 150-250 words for the about section."
}`
}

function parseRewriteResponse(content: string): GroqRewriteResponse {
  const jsonText = extractJson(content)
  const parsed = JSON.parse(jsonText) as Partial<GroqRewriteResponse>

  return {
    rewritten: String(parsed.rewritten ?? ""),
    improvements: Array.isArray(parsed.improvements)
      ? parsed.improvements.map(String)
      : [],
    keywords: Array.isArray(parsed.keywords) ? parsed.keywords.map(String) : [],
  }
}

function extractJson(content: string): string {
  const trimmed = content.trim()
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (fenced?.[1]) return fenced[1].trim()

  const start = trimmed.indexOf("{")
  const end = trimmed.lastIndexOf("}")
  if (start !== -1 && end > start) return trimmed.slice(start, end + 1)

  return trimmed
}

function ensureThreeItems(items: string[]): string[] {
  const filtered = items.filter(Boolean)
  while (filtered.length < 3) {
    filtered.push("Tightened language for recruiter scan speed.")
  }
  return filtered.slice(0, 3)
}

function mergeKeywords(
  fromModel: string[],
  context: string[],
  rewritten: string
): string[] {
  const lower = rewritten.toLowerCase()
  const merged = new Set<string>()

  for (const kw of [...fromModel, ...context]) {
    const normalized = kw.trim().toLowerCase()
    if (normalized && lower.includes(normalized)) {
      merged.add(kw.trim())
    }
  }

  for (const kw of context) {
    if (lower.includes(kw.toLowerCase()) && merged.size < 12) {
      merged.add(kw)
    }
  }

  return [...merged].slice(0, 10)
}

function extractTechFromText(text: string): string[] {
  const found: string[] = []
  for (const kw of ATS_KEYWORDS) {
    if (text.toLowerCase().includes(kw)) found.push(kw)
  }
  return found
}
