"use client"

import { motion } from "framer-motion"
import { AlertCircle, ChevronDown } from "lucide-react"
import { useState } from "react"
import { getHeadlineSection, hasQuantifiedExperience } from "@/lib/dashboard-utils"
import { cn } from "@/lib/utils"
import { itemVariants } from "@/lib/motion-variants"
import type { AnalysisResult } from "@/types"

type WeaknessAlert = {
  id: string
  message: string
  fix: string
}

function buildAlerts(result: AnalysisResult): WeaknessAlert[] {
  const { profile, analysis } = result
  const alerts: WeaknessAlert[] = []
  const headline = getHeadlineSection(result)

  if (analysis.overallScore < 60) {
    alerts.push({
      id: "threshold",
      message: "Profile below recruiter shortlist threshold",
      fix: "Raise your weakest sections first — headline and experience metrics move the needle fastest.",
    })
  }

  const hasGithub =
    !!profile.contactInfo.githubUrl || /github\.com/i.test(profile.rawText)
  if (!hasGithub) {
    alerts.push({
      id: "github",
      message: "No GitHub profile linked — critical for engineering roles",
      fix: "Add github.com/yourhandle to your LinkedIn contact section and feature 1–2 repos in Projects.",
    })
  }

  if (profile.projects.length === 0) {
    alerts.push({
      id: "projects",
      message: "No projects visible — top reason candidates are skipped",
      fix: "Add 2 projects with stack, outcome, and a repo or live link — even side projects count.",
    })
  }

  if (profile.experience.length > 0 && !hasQuantifiedExperience(result)) {
    alerts.push({
      id: "metrics",
      message: "Zero quantified achievements — generic profile",
      fix: 'Add numbers to each role: "Reduced latency 40%", "Shipped to 10k users", "$2M pipeline".',
    })
  }

  if (headline && headline.score < 10) {
    alerts.push({
      id: "headline",
      message: "Weak headline — recruiters spend 6 seconds on it",
      fix: "Rewrite as: [Role] · [Specialization] · [Proof point]. Drop vague openers.",
    })
  }

  if (profile.skills.length < 10) {
    alerts.push({
      id: "skills",
      message: "Thin skills section — ATS will filter this out",
      fix: "List 10–15 skills that match your target JD — tools, frameworks, and domains.",
    })
  }

  if (!profile.about.trim()) {
    alerts.push({
      id: "about",
      message: "Missing About section — first chance to tell your story",
      fix: "Write 3–4 lines: what you build, for whom, with what stack, and one measurable win.",
    })
  }

  return alerts
}

type WeaknessDetectionCardProps = {
  result: AnalysisResult
}

export function WeaknessDetectionCard({ result }: WeaknessDetectionCardProps) {
  const alerts = buildAlerts(result)

  if (alerts.length === 0) {
    return (
      <motion.div
        variants={itemVariants}
        className="card-hover glass-card rounded-3xl border border-emerald-500/20 p-6"
      >
        <h2 className="text-lg font-semibold text-white">
          What&apos;s making recruiters skip you
        </h2>
        <p className="mt-3 text-sm text-emerald-300/90">
          No critical auto-detected blockers. Focus on the improvement priorities above.
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div variants={itemVariants} className="card-hover glass-card rounded-3xl p-6">
      <h2 className="text-lg font-semibold text-white">
        What&apos;s making recruiters skip you
      </h2>
      <ul className="mt-4 space-y-3">
        {alerts.map((alert, i) => (
          <AlertItem key={alert.id} alert={alert} delay={i * 0.05} />
        ))}
      </ul>
    </motion.div>
  )
}

function AlertItem({ alert, delay }: { alert: WeaknessAlert; delay: number }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.li
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="overflow-hidden rounded-xl border-l-4 border-red-500 bg-red-500/5"
    >
      <div className="flex gap-3 p-4">
        <AlertCircle className="mt-0.5 size-5 shrink-0 text-red-400" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-red-100/95">{alert.message}</p>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="mt-2 flex items-center gap-1 text-xs font-medium text-red-300/80 hover:text-red-200"
          >
            How to fix
            <ChevronDown
              className={cn("size-3 transition-transform", open && "rotate-180")}
            />
          </button>
          {open && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-2 text-xs leading-relaxed text-zinc-400"
            >
              {alert.fix}
            </motion.p>
          )}
        </div>
      </div>
    </motion.li>
  )
}
