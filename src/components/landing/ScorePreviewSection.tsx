"use client"

import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"

const ScorePreviewChart = dynamic(
  () =>
    import("@/components/landing/ScorePreviewChartInner").then(
      (m) => m.ScorePreviewChartInner
    ),
  {
    ssr: false,
    loading: () => (
      <div className="glass-card mt-16 grid gap-8 rounded-3xl p-8 md:grid-cols-2">
        <Skeleton className="mx-auto h-64 w-64 rounded-full bg-white/10" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-8 w-full bg-white/10" />
          ))}
        </div>
      </div>
    ),
  }
)

export function ScorePreviewSection() {
  return (
    <section id="score-preview" className="px-6 py-20 sm:py-[120px]">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Your recruiter scorecard
          </h2>
          <p className="mt-4 text-base text-zinc-400 sm:text-lg">
            Sample output — no sugarcoating.
          </p>
        </motion.div>

        <ScorePreviewChart />
      </div>
    </section>
  )
}
