"use client"

import { motion } from "framer-motion"
import { Info } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  getScoreColor,
  getScorePercent,
  getSectionIcon,
} from "@/lib/dashboard-utils"
import { itemVariants } from "@/lib/motion-variants"
import { SECTION_TOOLTIPS } from "@/lib/section-tooltips"
import { cn } from "@/lib/utils"
import type { SectionScore } from "@/types"

const DISPLAY_ORDER = [
  "Headline",
  "Experience",
  "Projects",
  "ATS Keywords",
  "Personal Branding",
  "About",
  "Skills",
]

type SectionScoresGridProps = {
  sections: SectionScore[]
}

export function SectionScoresGrid({ sections }: SectionScoresGridProps) {
  const ordered = [...sections].sort((a, b) => {
    const ai = DISPLAY_ORDER.indexOf(a.section)
    const bi = DISPLAY_ORDER.indexOf(b.section)
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
  })

  return (
    <motion.div variants={itemVariants}>
      <h2 className="mb-4 text-lg font-semibold text-white">Section breakdown</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {ordered.map((section, i) => (
          <SectionScoreCard key={section.section} section={section} index={i} />
        ))}
      </div>
    </motion.div>
  )
}

function SectionScoreCard({
  section,
  index,
}: {
  section: SectionScore
  index: number
}) {
  const percent = getScorePercent(section)
  const colors = getScoreColor(percent)
  const Icon = getSectionIcon(section.section)
  const tooltip = SECTION_TOOLTIPS[section.section]
  const barDelay = 0.2 + index * 0.05

  return (
    <motion.div
      variants={itemVariants}
      className={cn("card-hover glass-card rounded-2xl p-5 shadow-lg", colors.glow)}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/5">
            <Icon className={cn("size-4", colors.text)} />
          </div>
          <span className="truncate font-medium text-white">{section.section}</span>
          {tooltip && (
            <Tooltip>
              <TooltipTrigger
                type="button"
                className="shrink-0 text-zinc-500 hover:text-zinc-300"
                aria-label={`About ${section.section} score`}
              >
                <Info className="size-3.5" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs text-xs leading-relaxed">
                {tooltip}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        <span className={cn("shrink-0 text-sm font-semibold tabular-nums", colors.text)}>
          {section.score}/{section.maxScore}
        </span>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className={cn("h-full rounded-full", colors.bar)}
          initial={{ width: "0%" }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.9, delay: barDelay, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {section.signals.slice(0, 3).map((signal) => (
          <span
            key={signal}
            className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-300"
          >
            {signal}
          </span>
        ))}
      </div>

      {section.missing.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {section.missing.slice(0, 2).map((flag) => (
            <span
              key={flag}
              className="rounded-md border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-[11px] text-red-300"
            >
              {flag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  )
}
