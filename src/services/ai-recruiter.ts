import { groqClient, MODELS } from "@/lib/groq"
import { GroqRateLimitError, withGroqRetry } from "@/lib/groq-errors"
import type {
  ProfileData,
  RecruiterAnalysis,
  SectionScore,
} from "@/types"

const SYSTEM_PROMPT = `You are a senior technical recruiter at a top-tier global tech company with 10 years of hiring experience. You have screened over 50,000 candidate profiles and have a sharp eye for what separates shortlisted candidates from those who get ignored.

Your analysis style is:
- Direct and honest, not motivational
- Data-driven — you cite specifics from the profile
- Psychologically astute — you explain WHY something will hurt the candidate
- Pragmatic — every suggestion you make is actionable in under 1 hour
- You do NOT say "great profile" or "impressive background" unless it genuinely is

Your output must be JSON only. No markdown, no preamble.`

type AICommentary = Pick<
  RecruiterAnalysis,
  | "firstImpression"
  | "strengths"
  | "weaknesses"
  | "recruiterConcerns"
  | "hireabilityAssessment"
  | "improvementPriorities"
  | "profileSummary"
>

export async function analyzeWithAI(
  profile: ProfileData,
  scores: SectionScore[]
): Promise<AICommentary> {
  const userPrompt = buildUserPrompt(profile, scores)

  try {
    return await callGroq(MODELS.primary, userPrompt)
  } catch (primaryError) {
    if (primaryError instanceof GroqRateLimitError) throw primaryError
    return await callGroq(MODELS.fast, userPrompt)
  }
}

function buildUserPrompt(profile: ProfileData, scores: SectionScore[]): string {
  return `Evaluate this candidate profile for technical hiring. Use the scoring data provided to calibrate your commentary.

SCORING SUMMARY:
${JSON.stringify(scores, null, 2)}

PROFILE DATA:
Name: ${profile.contactInfo.name}
Headline: ${profile.headline}
About: ${profile.about}
Experience: ${JSON.stringify(profile.experience)}
Projects: ${JSON.stringify(profile.projects)}
Skills: ${profile.skills.join(", ")}

Return a JSON object with this exact structure:
{
  "firstImpression": "2-3 sentence first impression a recruiter would have in the first 6 seconds",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["specific weakness 1", "specific weakness 2", "specific weakness 3"],
  "recruiterConcerns": ["concern that would make recruiter skip", "concern 2"],
  "hireabilityAssessment": "1 paragraph brutally honest assessment of this candidate's current hireability for mid-level tech roles",
  "improvementPriorities": ["#1 most impactful thing to fix", "#2", "#3"],
  "profileSummary": "One sentence summary of this profile's positioning"
}`
}

async function callGroq(model: string, userPrompt: string): Promise<AICommentary> {
  const completion = await withGroqRetry(() =>
    groqClient.chat.completions.create({
    model,
    temperature: 0.4,
    max_tokens: 1000,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    })
  )

  const content = completion.choices[0]?.message?.content
  if (!content) {
    throw new Error("Empty response from Groq")
  }

  return parseAIResponse(content)
}

function parseAIResponse(content: string): AICommentary {
  const jsonText = extractJson(content)
  const parsed = JSON.parse(jsonText) as Partial<AICommentary>

  return {
    firstImpression: String(parsed.firstImpression ?? ""),
    strengths: ensureStringArray(parsed.strengths, 3),
    weaknesses: ensureStringArray(parsed.weaknesses, 3),
    recruiterConcerns: ensureStringArray(parsed.recruiterConcerns, 2),
    hireabilityAssessment: String(parsed.hireabilityAssessment ?? ""),
    improvementPriorities: ensureStringArray(parsed.improvementPriorities, 3),
    profileSummary: String(parsed.profileSummary ?? ""),
  }
}

function extractJson(content: string): string {
  const trimmed = content.trim()
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (fenced?.[1]) return fenced[1].trim()

  const start = trimmed.indexOf("{")
  const end = trimmed.lastIndexOf("}")
  if (start !== -1 && end !== -1 && end > start) {
    return trimmed.slice(start, end + 1)
  }

  return trimmed
}

function ensureStringArray(value: unknown, minLength: number): string[] {
  if (!Array.isArray(value)) {
    return Array.from({ length: minLength }, () => "")
  }
  return value.map((item) => String(item))
}

export function mergeAnalysis(
  scoring: { sectionScores: SectionScore[]; overallScore: number },
  commentary: AICommentary
): RecruiterAnalysis {
  return {
    overallScore: scoring.overallScore,
    sectionScores: scoring.sectionScores,
    ...commentary,
  }
}
