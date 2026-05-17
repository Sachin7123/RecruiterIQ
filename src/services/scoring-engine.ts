import type { ProfileData, SectionScore } from "@/types"

const WEIGHTS = {
  headline: 15,
  about: 10,
  experience: 20,
  projects: 20,
  skills: 10,
  ats: 15,
  branding: 10,
} as const

const ROLE_TITLES =
  /\b(software engineer|product manager|data scientist|developer|designer|analyst|architect|consultant|manager|engineer|intern|devops|sre|frontend|backend|full[- ]?stack|ml engineer|researcher)\b/i

const SPECIALIZATION =
  /\b(backend|front[- ]?end|full[- ]?stack|ml|machine learning|mobile|cloud|devops|data|security|ios|android|embedded|blockchain|ai)\b/i

const TECH_KEYWORDS_HEADLINE =
  /\b(javascript|typescript|python|java|react|node\.?js|aws|docker|kubernetes|sql|graphql|rest|api|go\b|rust|c\+\+|\.net|ruby|php|swift|kotlin)\b/i

const IMPACT_PHRASES =
  /\b(building|scaling|leading|shipping|delivering|driving|launching|growing|transforming)\b/i

const GENERIC_HEADLINE =
  /\b(seeking opportunities|aspiring|looking for|open to work|enthusiastic|passionate about learning)\b/i

const GENERIC_ABOUT =
  /\b(passionate about|team player|hard worker|go[- ]?getter|think outside the box|synergy)\b/i

const MEASURABLE_ABOUT =
  /\d+[%x\+]?|\$[\d,]+[KMB]?|\b(scaled|built|led|grew|reduced|increased|delivered|shipped|launched|improved)\b/i

const QUANTIFIED_EXPERIENCE = /\d+[%x\+]|\$[\d,]+[KMB]?/i

const SENIORITY_PATTERN =
  /\b(intern|junior|associate|mid[- ]?level|senior|staff|principal|lead|manager|director|vp|head of)\b/i

const TECH_SKILLS_LIST = [
  "javascript",
  "typescript",
  "react",
  "python",
  "node.js",
  "nodejs",
  "aws",
  "docker",
  "sql",
  "rest api",
  "graphql",
  "git",
  "ci/cd",
  "java",
  "kubernetes",
  "postgresql",
  "mongodb",
]

const ATS_CATEGORIES = {
  tech: [
    "javascript",
    "typescript",
    "react",
    "python",
    "node.js",
    "nodejs",
    "aws",
    "docker",
    "sql",
    "rest api",
    "graphql",
    "git",
    "ci/cd",
  ],
  role: [
    "developed",
    "built",
    "implemented",
    "designed",
    "optimized",
    "led",
    "managed",
    "deployed",
    "architected",
  ],
  impact: [
    "improved",
    "reduced",
    "increased",
    "scaled",
    "automated",
    "shipped",
    "launched",
  ],
  soft: ["collaborated", "mentored", "cross-functional", "stakeholder"],
  tools: ["github", "jira", "figma", "vs code", "linux"],
} as const

export type ProfileScoringResult = {
  sectionScores: SectionScore[]
  overallScore: number
}

export function scoreProfile(profile: ProfileData): ProfileScoringResult {
  const sectionScores: SectionScore[] = [
    scoreHeadline(profile),
    scoreAbout(profile),
    scoreExperience(profile),
    scoreProjects(profile),
    scoreSkills(profile),
    scoreAtsKeywords(profile),
    scoreBranding(profile),
  ]

  const overallScore = calculateOverallScore(sectionScores)

  return { sectionScores, overallScore }
}

export function calculateOverallScore(sectionScores: SectionScore[]): number {
  const total = sectionScores.reduce((sum, section) => {
    const ratio =
      section.maxScore > 0 ? section.score / section.maxScore : 0
    return sum + ratio * section.weight
  }, 0)

  return Math.round(Math.min(100, Math.max(0, total)))
}

function sectionResult(
  section: string,
  score: number,
  maxScore: number,
  weight: number,
  signals: string[],
  missing: string[]
): SectionScore {
  return {
    section,
    score: Math.round(Math.min(maxScore, Math.max(0, score))),
    maxScore,
    weight,
    signals,
    missing,
  }
}

function scoreHeadline(profile: ProfileData): SectionScore {
  const maxScore = WEIGHTS.headline
  const headline = profile.headline.trim()
  const signals: string[] = []
  const missing: string[] = []
  let score = 0

  if (!headline || headline.length < 20) {
    missing.push("Headline empty or under 20 characters")
    return sectionResult("Headline", 0, maxScore, maxScore, signals, missing)
  }

  if (ROLE_TITLES.test(headline)) {
    score += 5
    signals.push("Clear role title detected")
  } else {
    missing.push("No clear role title in headline")
  }

  if (SPECIALIZATION.test(headline)) {
    score += 3
    signals.push("Specialization mentioned")
  }

  const techHits = countKeywordHits(headline, TECH_SKILLS_LIST)
  if (techHits >= 2) {
    score += 3
    signals.push(`${techHits} technical keywords in headline`)
  } else if (TECH_KEYWORDS_HEADLINE.test(headline)) {
    score += 2
    signals.push("Technical keyword present")
  } else {
    missing.push("Fewer than 2 technical keywords in headline")
  }

  if (headline.length >= 60 && headline.length <= 120) {
    score += 2
    signals.push("Headline length in optimal 60–120 char range")
  } else if (headline.length < 60) {
    missing.push("Headline shorter than 60 characters")
  }

  if (IMPACT_PHRASES.test(headline)) {
    score += 2
    signals.push("Impact phrase detected")
  }

  if (GENERIC_HEADLINE.test(headline)) {
    score -= 3
    missing.push("Generic headline phrasing detected")
  }

  return sectionResult("Headline", score, maxScore, maxScore, signals, missing)
}

function scoreAbout(profile: ProfileData): SectionScore {
  const maxScore = WEIGHTS.about
  const about = profile.about.trim()
  const signals: string[] = []
  const missing: string[] = []
  let score = 0

  if (!about) {
    missing.push("About section missing")
    return sectionResult("About", 0, maxScore, maxScore, signals, missing)
  }

  if (about.length > 200) {
    score += 4
    signals.push("About section exceeds 200 characters")
  } else {
    missing.push("About section under 200 characters")
  }

  if (MEASURABLE_ABOUT.test(about)) {
    score += 3
    signals.push("Measurable impact language in About")
  } else {
    missing.push("No quantified impact in About")
  }

  if (TECH_KEYWORDS_HEADLINE.test(about) || SPECIALIZATION.test(about)) {
    score += 2
    signals.push("Tech stack or domain mentioned")
  }

  if (about.length > 80 && !GENERIC_ABOUT.test(about)) {
    score += 1
    signals.push("Clear value proposition")
  }

  if (GENERIC_ABOUT.test(about)) {
    score -= 3
    missing.push("Generic About clichés detected")
  }

  return sectionResult("About", score, maxScore, maxScore, signals, missing)
}

function scoreExperience(profile: ProfileData): SectionScore {
  const maxScore = WEIGHTS.experience
  const { experience } = profile
  const signals: string[] = []
  const missing: string[] = []
  let score = 0

  if (experience.length === 0) {
    missing.push("No experience entries")
    return sectionResult("Experience", 0, maxScore, maxScore, signals, missing)
  }

  if (experience.length >= 2) {
    score += 8
    signals.push(`${experience.length} experience entries`)
  } else {
    missing.push("Fewer than 2 experience entries")
  }

  const detailed = experience.filter((e) => e.description.length > 100)
  if (detailed.length >= 1) {
    score += 4
    signals.push("At least one role has detailed description")
  } else {
    missing.push("No experience descriptions over 100 characters")
  }

  const quantified = experience.filter((e) =>
    QUANTIFIED_EXPERIENCE.test(e.description)
  )
  if (quantified.length >= 1) {
    score += 4
    signals.push("Quantified metrics in experience")
  } else {
    missing.push("No quantified metrics in job descriptions")
  }

  const recent = experience[0]
  if (recent && recent.description.length > 80) {
    score += 2
    signals.push("Most recent role has strong description")
  }

  const seniorities = experience.map((e) => {
    const text = `${e.title} ${e.description}`
    const match = text.match(SENIORITY_PATTERN)
    return match?.[0].toLowerCase() ?? ""
  })
  const uniqueSeniorities = new Set(seniorities.filter(Boolean))
  if (experience.length >= 2 && uniqueSeniorities.size >= 2) {
    score += 2
    signals.push("Career progression visible")
  } else if (experience.length >= 2) {
    score += 1
    signals.push("Multiple roles listed")
  }

  const allShort = experience.every((e) => e.description.length < 50)
  if (allShort) {
    score -= 3
    missing.push("All experience entries are title-only (under 50 chars)")
  }

  return sectionResult("Experience", score, maxScore, maxScore, signals, missing)
}

function scoreProjects(profile: ProfileData): SectionScore {
  const maxScore = WEIGHTS.projects
  const { projects, rawText } = profile
  const signals: string[] = []
  const missing: string[] = []
  let score = 0

  if (projects.length === 0) {
    missing.push("No projects section — critical for tech roles")
    return sectionResult("Projects", 0, maxScore, maxScore, signals, missing)
  }

  if (projects.length >= 2) {
    score += 6
    signals.push(`${projects.length} projects listed`)
  } else {
    missing.push("Fewer than 2 projects")
    score += 3
  }

  const hasGithub =
    projects.some((p) => p.hasGithub) || /github\.com/i.test(rawText)
  if (hasGithub) {
    score += 5
    signals.push("GitHub URL or mention present")
  } else {
    missing.push("No GitHub link on projects")
  }

  const withTech = projects.filter(
    (p) => p.techStack.length > 0 || TECH_KEYWORDS_HEADLINE.test(p.description)
  )
  if (withTech.length >= 1) {
    score += 4
    signals.push("Tech stack mentioned in projects")
  }

  if (projects.some((p) => p.hasLiveLink)) {
    score += 3
    signals.push("Live demo or deployed URL present")
  }

  const detailed = projects.filter((p) => p.description.length > 80)
  if (detailed.length >= 1) {
    score += 2
    signals.push("Project descriptions are substantive")
  } else {
    missing.push("Project descriptions are too short")
  }

  return sectionResult("Projects", score, maxScore, maxScore, signals, missing)
}

function scoreSkills(profile: ProfileData): SectionScore {
  const maxScore = WEIGHTS.skills
  const { skills, rawText } = profile
  const signals: string[] = []
  const missing: string[] = []
  let score = 0

  if (skills.length < 5) {
    missing.push("Under 5 skills listed")
    return sectionResult(
      "Skills",
      Math.max(0, skills.length),
      maxScore,
      maxScore,
      signals,
      missing
    )
  }

  if (skills.length >= 10) {
    score += 4
    signals.push(`${skills.length} skills listed`)
  } else {
    score += 2
    missing.push("Fewer than 10 skills")
  }

  const skillsText = skills.join(" ").toLowerCase()
  const relevantHits = countKeywordHits(skillsText, TECH_SKILLS_LIST)
  if (relevantHits >= 3) {
    score += 3
    signals.push("Role-relevant technical skills present")
  } else {
    missing.push("Limited technical skills for target roles")
  }

  if (
    /skills?\s*[:|]?\s*\n/i.test(rawText) ||
    skills.some((s) => s.includes(":"))
  ) {
    score += 2
    signals.push("Skills appear organized or categorized")
  }

  if (skills.length > 20) {
    score += 1
    signals.push("Extensive skills inventory (20+)")
  }

  return sectionResult("Skills", score, maxScore, maxScore, signals, missing)
}

function scoreAtsKeywords(profile: ProfileData): SectionScore {
  const maxScore = WEIGHTS.ats
  const corpus = buildCorpus(profile).toLowerCase()
  const signals: string[] = []
  const missing: string[] = []
  let score = 0

  const categoryLabels: Record<keyof typeof ATS_CATEGORIES, string> = {
    tech: "Tech keywords",
    role: "Role action verbs",
    impact: "Impact keywords",
    soft: "Collaboration signals",
    tools: "Tool keywords",
  }

  for (const [key, keywords] of Object.entries(ATS_CATEGORIES) as [
    keyof typeof ATS_CATEGORIES,
    readonly string[],
  ][]) {
    const hits = countKeywordHits(corpus, keywords)
    if (hits >= 2) {
      score += 3
      signals.push(`${categoryLabels[key]}: ${hits} matches`)
    } else {
      missing.push(`Weak ${categoryLabels[key].toLowerCase()} coverage`)
    }
  }

  return sectionResult("ATS Keywords", score, maxScore, maxScore, signals, missing)
}

function scoreBranding(profile: ProfileData): SectionScore {
  const maxScore = WEIGHTS.branding
  const { contactInfo, links, rawText } = profile
  const signals: string[] = []
  const missing: string[] = []
  let score = 0

  const linkedin = contactInfo.linkedinUrl ?? ""
  const customLinkedin =
    /linkedin\.com\/in\/[a-zA-Z][a-zA-Z0-9_-]{2,}/i.test(linkedin) &&
    !/linkedin\.com\/in\/\d+$/i.test(linkedin)

  if (customLinkedin) {
    score += 3
    signals.push("Custom LinkedIn URL slug")
  } else if (linkedin) {
    score += 1
    missing.push("LinkedIn URL uses numeric ID, not custom slug")
  } else {
    missing.push("No LinkedIn URL detected")
  }

  const hasGithub =
    !!contactInfo.githubUrl || /github\.com\/[a-zA-Z0-9_-]+/i.test(rawText)
  if (hasGithub) {
    score += 3
    signals.push("GitHub profile URL present")
  } else {
    missing.push("No GitHub profile URL")
  }

  const portfolio = links.find(
    (url) =>
      !/linkedin\.com|github\.com/i.test(url) &&
      /^https?:\/\//i.test(url)
  )
  if (portfolio) {
    score += 2
    signals.push("Personal website or portfolio URL")
  }

  if (contactInfo.email && isProfessionalEmail(contactInfo.email)) {
    score += 2
    signals.push("Professional contact email")
  } else if (!contactInfo.email && !contactInfo.phone) {
    score -= 3
    missing.push("No contact info detected")
  }

  return sectionResult("Personal Branding", score, maxScore, maxScore, signals, missing)
}

function buildCorpus(profile: ProfileData): string {
  return [
    profile.headline,
    profile.about,
    profile.skills.join(" "),
    profile.experience.map((e) => `${e.title} ${e.description}`).join(" "),
    profile.projects.map((p) => `${p.name} ${p.description}`).join(" "),
    profile.rawText,
  ].join(" ")
}

function countKeywordHits(text: string, keywords: readonly string[]): number {
  const lower = text.toLowerCase()
  return keywords.filter((kw) => lower.includes(kw.toLowerCase())).length
}

function isProfessionalEmail(email: string): boolean {
  const lower = email.toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lower)) return false
  const [local, domain] = lower.split("@")
  if (/^\d+$/.test(local)) return false
  if (/^[a-z]{1,2}\d{5,}@gmail\.com$/.test(lower)) return false
  if (domain.includes("linkedin")) return false
  return true
}
