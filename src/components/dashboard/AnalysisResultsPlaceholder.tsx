"use client"

import { motion } from "framer-motion"
import type { AnalysisResult } from "@/types"

type AnalysisResultsPlaceholderProps = {
  result: AnalysisResult
  onReset: () => void
}

export function AnalysisResultsPlaceholder({
  result,
  onReset,
}: AnalysisResultsPlaceholderProps) {
  const { analysis, profile } = result

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto w-full max-w-3xl"
    >
      <motion.div className="glass-card rounded-3xl p-8 md:p-12">
        <p className="text-sm font-medium uppercase tracking-wider text-indigo-400">
          Analysis complete
        </p>
        <div className="mt-4 flex flex-wrap items-end gap-4">
          <p className="font-display text-6xl font-bold text-white">
            {analysis.overallScore}
            <span className="text-2xl text-zinc-500">/100</span>
          </p>
          <p className="pb-2 text-zinc-400">
            {profile.contactInfo.name || "Your profile"}
          </p>
        </div>
        <p className="mt-4 text-lg text-zinc-300">{analysis.firstImpression}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {analysis.sectionScores.map((section) => (
            <div
              key={section.section}
              className="rounded-xl border border-white/10 bg-white/5 p-4"
            >
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">{section.section}</span>
                <span className="font-medium text-white">{section.score}</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                  style={{ width: `${section.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {analysis.weaknesses.length > 0 && (
          <div className="mt-8 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
            <p className="text-sm font-medium text-amber-300">Top concern</p>
            <p className="mt-1 text-sm text-amber-100/90">
              {analysis.weaknesses[0]}
            </p>
          </div>
        )}

        <p className="mt-8 text-center text-sm text-zinc-500">
          Full dashboard UI ships in Phase 4. Parsed{" "}
          {profile.experience.length} roles, {profile.skills.length} skills.
        </p>

        <motion.button
          type="button"
          onClick={onReset}
          className="mt-6 w-full rounded-xl border border-white/15 py-3 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
        >
          Analyze another profile
        </motion.button>
      </motion.div>

      {process.env.NODE_ENV === "development" && (
        <details className="mt-6 glass-card rounded-xl p-4">
          <summary className="cursor-pointer text-sm text-zinc-400">
            Dev: parsed ProfileData
          </summary>
          <pre className="mt-4 max-h-96 overflow-auto text-xs text-zinc-500">
            {JSON.stringify(profile, null, 2)}
          </pre>
        </details>
      )}
    </motion.div>
  )
}
