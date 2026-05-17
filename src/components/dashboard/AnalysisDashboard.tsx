"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { CandidateSummaryCard } from "@/components/dashboard/CandidateSummaryCard"
import { OverallScoreCard } from "@/components/dashboard/OverallScoreCard"
import { RecruiterInsightsCard } from "@/components/dashboard/RecruiterInsightsCard"
import { RewriteEngineCard } from "@/components/dashboard/RewriteEngineCard"
import { ScorecardExport } from "@/components/dashboard/ScorecardExport"
import { SectionScoresGrid } from "@/components/dashboard/SectionScoresGrid"
import { WeaknessDetectionCard } from "@/components/dashboard/WeaknessDetectionCard"
import { EmptyProfileState } from "@/components/shared/EmptyProfileState"
import { isProfileEmpty } from "@/lib/dashboard-utils"
import { containerVariants } from "@/lib/motion-variants"
import type { AnalysisResult } from "@/types"

type AnalysisDashboardProps = {
  result: AnalysisResult
}

export function AnalysisDashboard({ result }: AnalysisDashboardProps) {
  const { profile, analysis } = result

  if (isProfileEmpty(profile)) {
    return <EmptyProfileState />
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="mx-auto max-w-7xl overflow-x-hidden"
    >
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-indigo-400">
            Recruiter report
          </p>
          <h1 className="font-display mt-1 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
            Your profile scorecard
          </h1>
        </div>
        <Link
          href="/analyze"
          className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg border border-white/15 px-4 text-sm font-medium text-zinc-300 transition-colors hover:border-indigo-500/40 hover:bg-white/5 hover:text-white active:scale-[0.97]"
        >
          Re-analyze profile
        </Link>
      </div>

      <motion.div
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="flex flex-col gap-6 lg:col-span-3">
            <OverallScoreCard analysis={analysis} />
            <SectionScoresGrid sections={analysis.sectionScores} />
            <RecruiterInsightsCard analysis={analysis} />
            <WeaknessDetectionCard result={result} />
          </div>

          <div className="flex flex-col gap-6 lg:col-span-2">
            <CandidateSummaryCard
              profile={profile}
              profileSummary={analysis.profileSummary}
            />
            <ScorecardExport result={result} />
          </div>
        </div>

        <RewriteEngineCard profile={profile} />
      </motion.div>
    </motion.div>
  )
}
