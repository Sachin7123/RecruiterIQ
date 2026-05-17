"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { GradientButton } from "@/components/shared/GradientButton"

const sections = [
  { label: "Headline", score: 80, pct: 80 },
  { label: "Experience", score: 65, pct: 65 },
  { label: "Projects", score: 55, pct: 55 },
  { label: "ATS Match", score: 70, pct: 70 },
]

export function DemoPreview() {
  return (
    <section className="px-6 py-20 sm:py-[120px]">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-5xl"
      >
        <div className="glass-card overflow-hidden rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-indigo-400">
                Sample report
              </p>
              <p className="font-display mt-2 text-3xl font-bold text-white sm:text-4xl">
                72
                <span className="text-lg text-zinc-500">/100</span>
              </p>
              <p className="mt-1 text-sm text-indigo-300">Above average profile</p>
              <p className="mt-3 max-w-sm text-sm text-zinc-400">
                Alex Chen · Software Engineer · React, Node, AWS
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                Clear role + stack
              </span>
              <span className="rounded-full border border-red-400/30 bg-red-500/10 px-3 py-1 text-xs text-red-300">
                Weak metrics in bullets
              </span>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {sections.map((section, i) => (
              <motion.div
                key={section.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-zinc-300">{section.label}</span>
                  <span className="font-medium tabular-nums text-white">{section.score}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    style={{ width: `${section.pct}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
            <p className="text-center text-sm text-zinc-400 sm:text-left">
              Real recruiter signals. Real improvement data.
            </p>
            <GradientButton href="/analyze/demo" size="default" className="shrink-0">
              View full demo
              <ArrowRight className="ml-1 size-4" />
            </GradientButton>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-zinc-500">
          No upload required —{" "}
          <Link href="/analyze/demo" className="text-indigo-400 underline hover:text-indigo-300">
            open the interactive demo
          </Link>
        </p>
      </motion.div>
    </section>
  )
}
