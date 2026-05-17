import type { LucideIcon } from "lucide-react"
import {
  Award,
  Briefcase,
  Code,
  FileText,
  Layers,
  Search,
  Type,
} from "lucide-react"
import type { AnalysisResult, ProfileData, SectionScore } from "@/types"

export function isProfileEmpty(profile: ProfileData): boolean {
  const hasName = Boolean(profile.contactInfo.name?.trim())
  const hasContent =
    Boolean(profile.headline?.trim()) ||
    Boolean(profile.about?.trim()) ||
    profile.experience.length > 0 ||
    profile.skills.length > 0
  return !hasName && !hasContent
}

export function getScorePercent(section: SectionScore): number {
  if (section.maxScore <= 0) return 0
  return Math.round((section.score / section.maxScore) * 100)
}

export function getScoreColor(percent: number): {
  bar: string
  text: string
  glow: string
} {
  if (percent >= 75) {
    return {
      bar: "bg-emerald-500",
      text: "text-emerald-400",
      glow: "shadow-emerald-500/20",
    }
  }
  if (percent >= 50) {
    return {
      bar: "bg-amber-400",
      text: "text-amber-400",
      glow: "shadow-amber-500/20",
    }
  }
  return {
    bar: "bg-red-500",
    text: "text-red-400",
    glow: "shadow-red-500/20",
  }
}

export function getOverallLabel(score: number): {
  label: string
  colorClass: string
  gradientClass: string
} {
  if (score >= 75) {
    return {
      label: "Strong Profile",
      colorClass: "text-emerald-400",
      gradientClass: "from-emerald-400 to-teal-400",
    }
  }
  if (score >= 50) {
    return {
      label: "Average",
      colorClass: "text-amber-400",
      gradientClass: "from-amber-400 to-orange-400",
    }
  }
  return {
    label: "Needs Work",
    colorClass: "text-red-400",
    gradientClass: "from-red-400 to-rose-500",
  }
}

const SECTION_ICONS: Record<string, LucideIcon> = {
  Headline: Type,
  About: FileText,
  Experience: Briefcase,
  Projects: Code,
  Skills: Layers,
  "ATS Keywords": Search,
  "Personal Branding": Award,
}

export function getSectionIcon(section: string): LucideIcon {
  return SECTION_ICONS[section] ?? FileText
}

export function hasQuantifiedExperience(result: AnalysisResult): boolean {
  return result.profile.experience.some((e) =>
    /\d+[%x\+]|\$[\d,]+[KMB]?/i.test(e.description)
  )
}

export function getHeadlineSection(
  result: AnalysisResult
): SectionScore | undefined {
  return result.analysis.sectionScores.find((s) => s.section === "Headline")
}
