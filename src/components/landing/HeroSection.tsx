"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { GradientButton } from "@/components/shared/GradientButton"
import { GhostButton } from "@/components/shared/GhostButton"
import { SITE_AUTHOR } from "@/lib/site-config"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
}

const mockSections = [
  { label: "Headline", score: 88 },
  { label: "Experience", score: 82 },
  { label: "Projects", score: 79 },
  { label: "ATS Match", score: 91 },
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 pb-32 pt-32 md:pt-40">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.18),transparent)]" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="text-center lg:text-left"
        >
          <motion.div variants={item}>
            <span className="shimmer-badge inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-zinc-300">
              Trusted by 1,000+ job seekers
            </span>
          </motion.div>
          <motion.h1
            variants={item}
            className="font-display mt-6 text-3xl font-bold leading-[1.08] tracking-tight text-white sm:mt-8 sm:text-5xl md:text-6xl lg:text-[4rem]"
          >
            See how recruiters <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-500 bg-clip-text text-transparent">
              actually evaluate
            </span>{" "}
            <br />
            your LinkedIn profile.
          </motion.h1>
          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400 md:text-xl"
          >
            Upload your PDF. Get a brutally honest recruiter scorecard in 30
            seconds. No fluff, no generic tips.
          </motion.p>
          <motion.div
            variants={item}
            className="mt-8 flex flex-col items-center gap-4 sm:mt-10 sm:flex-row sm:items-center lg:items-start"
          >
            <GradientButton href="/analyze" size="lg">
              Analyze My Profile →
            </GradientButton>
            <GhostButton href="/analyze/demo">See demo report</GhostButton>
          </motion.div>
          <motion.p
            variants={item}
            className="mt-6 text-sm text-zinc-500"
          >
            Built by{" "}
            <Link
              href={SITE_AUTHOR.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 underline-offset-4 transition-colors hover:text-indigo-300 hover:underline"
            >
              {SITE_AUTHOR.name}
            </Link>
            {" · "}
            <Link
              href={SITE_AUTHOR.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 underline-offset-4 transition-colors hover:text-indigo-300 hover:underline"
            >
              GitHub
            </Link>
          </motion.p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex justify-center lg:justify-end"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="glass-card w-full max-w-md rounded-2xl p-6 shadow-2xl shadow-indigo-500/10"
          >
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-400">Recruiter Score</p>
                <p className="font-display mt-1 text-5xl font-bold text-white">
                  85<span className="text-2xl text-zinc-500">/100</span>
                </p>
              </div>
              <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-400">
                Strong shortlist signal
              </span>
            </div>
            <div className="mt-6 space-y-4">
              {mockSections.map((section) => (
                <div key={section.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-400">{section.label}</span>
                    <span className="font-medium text-white">{section.score}</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                      style={{ width: `${section.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
