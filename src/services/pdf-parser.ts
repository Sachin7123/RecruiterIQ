import { PDFParse } from "pdf-parse"
import type {
  ContactInfo,
  Education,
  Experience,
  ProfileData,
  Project,
} from "@/types"

const SECTION_HEADERS =
  /^(about|experience|education|skills|projects|certifications?|licenses(?:\s*&\s*certifications)?|honors(?:\s*&\s*awards)?|volunteer(?:\s*experience)?|languages|contact|summary|top\s*skills)\s*$/i

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
const LINKEDIN_REGEX =
  /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/gi
const GITHUB_REGEX = /(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/gi
const PHONE_REGEX =
  /(?:\+?\d{1,3}[\s.-]?)?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}/g
const DATE_RANGE_REGEX =
  /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{4}\s*[-–—]\s*(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{4}|present|current)\b/gi
const YEAR_REGEX = /\b(19|20)\d{2}\b/

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const parser = new PDFParse({ data: buffer })
  try {
    const result = await parser.getText()
    return cleanText(result.text)
  } finally {
    await parser.destroy()
  }
}

export function cleanText(raw: string): string {
  let text = raw
    .replace(/\u0000/g, "")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/Page\s+\d+\s+of\s+\d+/gi, "")
    .replace(/^\s*\d+\s*$/gm, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()

  const lines = text.split("\n").map((line) => line.trim())
  const deduped: string[] = []
  for (const line of lines) {
    if (!line) {
      if (deduped.at(-1) !== "") deduped.push("")
      continue
    }
    if (deduped.at(-1) === line) continue
    deduped.push(line)
  }

  return deduped.join("\n").trim()
}

export function parseProfileSections(rawText: string): ProfileData {
  const text = cleanText(rawText)
  const empty = emptyProfile(text)

  if (!text) return empty

  try {
    const contactInfo = extractContactInfo(text)
    const sections = splitIntoSections(text)
    const preamble = sections.get("_preamble") ?? ""
    const { name, headline } = extractNameAndHeadline(preamble, contactInfo.name)

    contactInfo.name = contactInfo.name || name

    const about = parseAboutSection(sections.get("about") ?? sections.get("summary") ?? "")
    const experience = parseExperienceSection(sections.get("experience") ?? "")
    const education = parseEducationSection(sections.get("education") ?? "")
    const skills = parseSkillsSection(sections.get("skills") ?? sections.get("top skills") ?? "")
    const projects = parseProjectsSection(sections.get("projects") ?? "")
    const certifications = parseCertificationsSection(
      sections.get("certifications") ??
        sections.get("certification") ??
        sections.get("licenses") ??
        sections.get("licenses & certifications") ??
        ""
    )

    const links = extractLinks(text)

    return {
      headline: headline || empty.headline,
      about,
      skills,
      experience,
      education,
      certifications,
      projects,
      links,
      contactInfo,
      rawText: text,
    }
  } catch {
    return empty
  }
}

function emptyProfile(rawText: string): ProfileData {
  return {
    headline: "",
    about: "",
    skills: [],
    experience: [],
    education: [],
    certifications: [],
    projects: [],
    links: [],
    contactInfo: { name: "" },
    rawText,
  }
}

function splitIntoSections(text: string): Map<string, string> {
  const sections = new Map<string, string>()
  const lines = text.split("\n")
  let currentKey = "_preamble"
  let buffer: string[] = []

  const flush = () => {
    const body = buffer.join("\n").trim()
    if (body) {
      const existing = sections.get(currentKey)
      sections.set(currentKey, existing ? `${existing}\n\n${body}` : body)
    }
    buffer = []
  }

  for (const line of lines) {
    const headerMatch = line.match(SECTION_HEADERS)
    if (headerMatch) {
      flush()
      currentKey = headerMatch[1].toLowerCase().replace(/\s+/g, " ")
      continue
    }
    buffer.push(line)
  }
  flush()

  return sections
}

function extractContactInfo(text: string): ContactInfo {
  const emails = text.match(EMAIL_REGEX) ?? []
  const linkedin = text.match(LINKEDIN_REGEX) ?? []
  const github = text.match(GITHUB_REGEX) ?? []
  const phones = text.match(PHONE_REGEX) ?? []

  const links = [...linkedin, ...github]
  const locationMatch = text.match(
    /(?:^|\n)([A-Za-z\s,]+(?:Area|Metropolitan|Region)?)\s*(?:\n|$)/m
  )

  return {
    name: "",
    email: emails[0],
    phone: phones[0],
    location: locationMatch?.[1]?.trim(),
    linkedinUrl: linkedin[0],
    githubUrl: github[0],
  }
}

function extractLinks(text: string): string[] {
  const urls = text.match(/https?:\/\/[^\s)]+/gi) ?? []
  return [...new Set(urls.map((u) => u.replace(/[.,;]+$/, "")))]
}

function extractNameAndHeadline(
  preamble: string,
  existingName: string
): { name: string; headline: string } {
  const lines = preamble
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .filter((l) => !isContactLine(l))

  if (lines.length === 0) {
    return { name: existingName, headline: "" }
  }

  const name = existingName || lines[0]
  const headline =
    lines.find((line, i) => i > 0 && line.length > 8 && !isContactLine(line)) ?? ""

  return { name, headline }
}

function isContactLine(line: string): boolean {
  return (
    EMAIL_REGEX.test(line) ||
    LINKEDIN_REGEX.test(line) ||
    GITHUB_REGEX.test(line) ||
    /^www\./i.test(line) ||
    /^https?:/i.test(line)
  )
}

function parseAboutSection(content: string): string {
  return content.replace(/\n+/g, " ").trim()
}

function parseSkillsSection(content: string): string[] {
  if (!content) return []

  const bulletSkills = content
    .split("\n")
    .map((l) => l.replace(/^[-•*]\s*/, "").trim())
    .filter((l) => l.length > 1 && l.length < 80)

  if (bulletSkills.length > 2) {
    return [...new Set(bulletSkills)]
  }

  const commaSkills = content
    .split(/[,;|]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1 && s.length < 60)

  return [...new Set(commaSkills)]
}

function parseCertificationsSection(content: string): string[] {
  if (!content) return []
  return content
    .split("\n")
    .map((l) => l.replace(/^[-•*]\s*/, "").trim())
    .filter((l) => l.length > 2)
}

function parseExperienceSection(content: string): Experience[] {
  if (!content) return []

  const blocks = splitExperienceBlocks(content)
  const results: Experience[] = []

  for (const block of blocks) {
    const parsed = parseExperienceBlock(block)
    if (parsed) results.push(parsed)
  }

  return results
}

function splitExperienceBlocks(content: string): string[] {
  const lines = content.split("\n")
  const blocks: string[] = []
  let current: string[] = []

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) {
      if (current.length) {
        blocks.push(current.join("\n"))
        current = []
      }
      continue
    }

    const looksLikeNewRole =
      DATE_RANGE_REGEX.test(trimmed) &&
      current.length > 0 &&
      current.some((l) => DATE_RANGE_REGEX.test(l))

    if (looksLikeNewRole && current.length >= 2) {
      blocks.push(current.join("\n"))
      current = [trimmed]
    } else {
      current.push(trimmed)
    }
  }

  if (current.length) blocks.push(current.join("\n"))

  if (blocks.length <= 1) {
    return content.split(/\n\n+/).filter((b) => b.trim().length > 10)
  }

  return blocks
}

function parseExperienceBlock(block: string): Experience | null {
  const lines = block
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)

  if (lines.length === 0) return null

  let title = lines[0]
  let company = ""
  let duration = ""
  let location: string | undefined
  const descriptionLines: string[] = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    if (DATE_RANGE_REGEX.test(line) && !duration) {
      duration = line
      continue
    }
    if (
      !company &&
      (line.includes("·") || line.includes("|") || /\bat\b/i.test(line))
    ) {
      const parts = line.split(/·|\||\bat\b/i).map((p) => p.trim())
      title = title || parts[0]
      company = parts[1] ?? parts[0]
      if (parts.length > 2) location = parts[2]
      continue
    }
    if (!company && i === 1 && line.length < 80) {
      company = line
      continue
    }
    if (
      !location &&
      i <= 3 &&
      /^[A-Za-z\s,]+$/.test(line) &&
      line.length < 60 &&
      !DATE_RANGE_REGEX.test(line)
    ) {
      location = line
      continue
    }
    descriptionLines.push(line)
  }

  if (!company && lines[1]) company = lines[1]

  return {
    title: title || "Role",
    company: company || "Company",
    duration,
    description: descriptionLines.join(" ").trim(),
    location,
  }
}

function parseEducationSection(content: string): Education[] {
  if (!content) return []

  const blocks = content.split(/\n\n+/).filter((b) => b.trim())
  const results: Education[] = []

  for (const block of blocks) {
    const lines = block
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
    if (lines.length === 0) continue

    const yearMatch = block.match(YEAR_REGEX)
    const year = yearMatch?.[0] ?? ""

    let degree = lines[0]
    let institution = lines[1] ?? ""
    let field: string | undefined

    if (lines.length >= 3) {
      const fieldLine = lines.find(
        (l) => l !== degree && l !== institution && !YEAR_REGEX.test(l)
      )
      field = fieldLine
    }

    if (institution && YEAR_REGEX.test(institution) && !year) {
      institution = lines[2] ?? institution
    }

    results.push({
      degree,
      institution: institution || "Institution",
      year,
      field,
    })
  }

  if (results.length === 0) {
    const lines = content.split("\n").filter(Boolean)
    if (lines.length >= 2) {
      results.push({
        degree: lines[0],
        institution: lines[1],
        year: lines.find((l) => YEAR_REGEX.test(l))?.match(YEAR_REGEX)?.[0] ?? "",
      })
    }
  }

  return results
}

function parseProjectsSection(content: string): Project[] {
  if (!content) return []

  const blocks = content.split(/\n\n+/).filter((b) => b.trim())
  const results: Project[] = []

  for (const block of blocks) {
    const lines = block
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
    if (lines.length === 0) continue

    const name = lines[0]
    const description = lines.slice(1).join(" ")
    const hasGithub = /github\.com/i.test(block)
    const hasLiveLink = /https?:\/\//i.test(block) && !hasGithub

    const techStack = lines
      .flatMap((l) => l.split(/[,;|]/))
      .map((t) => t.trim())
      .filter((t) => t.length > 1 && t.length < 40)

    results.push({
      name,
      description,
      techStack: techStack.slice(0, 12),
      hasGithub,
      hasLiveLink,
    })
  }

  return results
}
