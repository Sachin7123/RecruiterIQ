export interface ProfileData {
  headline: string
  about: string
  skills: string[]
  experience: Experience[]
  education: Education[]
  certifications: string[]
  projects: Project[]
  links: string[]
  contactInfo: ContactInfo
  rawText: string
}

export interface Experience {
  title: string
  company: string
  duration: string
  description: string
  location?: string
}

export interface Education {
  degree: string
  institution: string
  year: string
  field?: string
}

export interface Project {
  name: string
  description: string
  techStack: string[]
  hasGithub: boolean
  hasLiveLink: boolean
}

export interface ContactInfo {
  name: string
  email?: string
  phone?: string
  location?: string
  linkedinUrl?: string
  githubUrl?: string
}

export interface SectionScore {
  section: string
  score: number
  maxScore: number
  signals: string[]
  missing: string[]
  weight: number
}

export interface RecruiterAnalysis {
  overallScore: number
  sectionScores: SectionScore[]
  firstImpression: string
  strengths: string[]
  weaknesses: string[]
  recruiterConcerns: string[]
  hireabilityAssessment: string
  improvementPriorities: string[]
  profileSummary: string
}

export interface AnalysisResult {
  profile: ProfileData
  analysis: RecruiterAnalysis
  analysisId: string
  createdAt: string
}

export type RewriteMode = "startup" | "faang" | "recruiter" | "internship"

export type RewriteSection = "headline" | "about"

export interface RewriteResult {
  original: string
  rewritten: string
  mode: RewriteMode
  improvements: string[]
  keywords: string[]
}
