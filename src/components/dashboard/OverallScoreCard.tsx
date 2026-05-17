"use client"

import { motion } from "framer-motion"
import { AlertTriangle } from "lucide-react"
import { AnimatedScore } from "@/components/dashboard/AnimatedScore"
import { itemVariants } from "@/lib/motion-variants"
import type { RecruiterAnalysis } from "@/types"

type OverallScoreCardProps = {
  analysis: RecruiterAnalysis
}

export function OverallScoreCard({ analysis }: OverallScoreCardProps) {
  return (
    <motion.div
      variants={itemVariants}
      className="card-hover glass-card overflow-hidden rounded-3xl p-6 md:p-8"
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <AnimatedScore score={analysis.overallScore} />

        <div className="flex-1 lg:max-w-xl lg:border-l lg:border-white/10 lg:pl-8">
          <p className="text-sm font-medium uppercase tracking-wider text-zinc-500">
            Recruiter verdict
          </p>
          <blockquote className="mt-3 break-words border-l-2 border-indigo-500/50 pl-4 text-lg italic leading-relaxed text-zinc-300">
            &ldquo;{analysis.firstImpression}&rdquo;
          </blockquote>
          <p className="mt-4 text-base leading-relaxed text-zinc-400">
            {analysis.hireabilityAssessment}
          </p>
          {analysis.recruiterConcerns.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {analysis.recruiterConcerns.slice(0, 3).map((concern) => (
                <span
                  key={concern}
                  className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-300"
                >
                  <AlertTriangle className="size-3 shrink-0" />
                  {concern}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
