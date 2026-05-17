"use client"

import { motion } from "framer-motion"
import { Upload, Cpu, FileBarChart } from "lucide-react"

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload LinkedIn PDF or resume",
    description: "Export from LinkedIn or drop your resume PDF. We parse the structure recruiters scan first.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI + rule engine scores your profile",
    description: "Groq-powered analysis plus deterministic scoring on ATS, branding, and experience signals.",
  },
  {
    icon: FileBarChart,
    step: "03",
    title: "Get your recruiter report in 30 seconds",
    description: "Section scores, weaknesses, and priorities — written like a hiring manager, not a life coach.",
  },
]

export function HowItWorksSection() {
  return (
    <section className="px-6 py-[120px]">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-center text-4xl font-bold tracking-tight text-white md:text-5xl"
        >
          How it works
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="relative mt-20"
        >
          <div className="absolute left-0 right-0 top-12 hidden h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent md:block" />
          <motion.div
            className="absolute left-[16.66%] right-[16.66%] top-12 hidden h-px md:block"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.3 }}
            style={{ originX: 0 }}
          >
            <div className="h-full w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-60" />
          </motion.div>

          <motion.div
            className="grid gap-12 md:grid-cols-3 md:gap-8"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.15 } },
            }}
          >
            {steps.map((step) => (
              <motion.div
                key={step.step}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  show: { opacity: 1, y: 0 },
                }}
                className="relative text-center"
              >
                <motion.div
                  className="relative z-10 mx-auto flex size-24 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                >
                  <step.icon className="size-8 text-indigo-400" />
                  <span className="absolute -right-1 -top-1 flex size-7 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-xs font-bold text-white">
                    {step.step.slice(-1)}
                  </span>
                </motion.div>
                <h3 className="mt-6 text-xl font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-zinc-400">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
