"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { AlertCircle } from "lucide-react"
import { RadialBar, RadialBarChart } from "recharts"

const sectionScores = [
  { name: "Headline", score: 80, fill: "#6366f1" },
  { name: "Experience", score: 65, fill: "#818cf8" },
  { name: "Projects", score: 55, fill: "#a78bfa" },
  { name: "ATS", score: 70, fill: "#8b5cf6" },
  { name: "Branding", score: 40, fill: "#c4b5fd" },
]

const radialData = [{ name: "Score", value: 72, fill: "url(#scoreGradient)" }]

const CHART_SIZE = 256

export function ScorePreviewChartInner() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="glass-card mt-16 grid gap-12 rounded-3xl p-6 sm:p-8 md:grid-cols-2 md:p-12">
      <div className="flex flex-col items-center justify-center">
        <div
          className="relative shrink-0"
          style={{ width: CHART_SIZE, height: CHART_SIZE }}
        >
          {mounted ? (
            <RadialBarChart
              width={CHART_SIZE}
              height={CHART_SIZE}
              cx="50%"
              cy="50%"
              innerRadius="72%"
              outerRadius="100%"
              barSize={14}
              data={radialData}
              startAngle={90}
              endAngle={-270}
            >
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <RadialBar
                background={{ fill: "rgba(255,255,255,0.08)" }}
                dataKey="value"
                cornerRadius={8}
              />
            </RadialBarChart>
          ) : (
            <div className="size-full rounded-full bg-white/5" aria-hidden />
          )}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className="font-display text-5xl font-bold text-white sm:text-6xl"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, type: "spring" }}
            >
              72
            </motion.span>
            <span className="text-sm text-zinc-500">/ 100</span>
          </div>
        </div>
        <p className="mt-4 text-sm font-medium text-zinc-400">Overall recruiter score</p>
      </div>

      <motion.div
        className="flex flex-col justify-center space-y-5"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.1 } },
        }}
      >
        {sectionScores.map((section) => (
          <motion.div
            key={section.name}
            variants={{
              hidden: { opacity: 0, x: 16 },
              show: { opacity: 1, x: 0 },
            }}
          >
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-zinc-300">{section.name}</span>
              <span className="font-medium text-white">{section.score}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: section.fill }}
                initial={{ width: 0 }}
                whileInView={{ width: `${section.score}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </motion.div>
        ))}

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 12 },
            show: { opacity: 1, y: 0 },
          }}
          className="mt-4 flex gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4"
        >
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-amber-400" />
          <p className="text-sm leading-relaxed text-amber-100/90">
            No quantified metrics detected in 3 job descriptions
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
