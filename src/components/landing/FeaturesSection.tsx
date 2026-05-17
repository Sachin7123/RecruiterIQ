"use client"

import { motion } from "framer-motion"
import {
  Brain,
  FileSearch,
  Layers,
  AlertTriangle,
  PenLine,
  Share2,
} from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "Recruiter Psychology Engine",
    description:
      "Not generic AI — trained on real hiring patterns and recruiter decision-making.",
  },
  {
    icon: FileSearch,
    title: "ATS Keyword Scanner",
    description:
      "50+ recruiter keywords checked against your profile content.",
  },
  {
    icon: Layers,
    title: "Section-by-Section Score",
    description:
      "Headline, about, experience, projects, and personal branding — scored separately.",
  },
  {
    icon: AlertTriangle,
    title: "Weakness Detection",
    description:
      "Exactly what's making recruiters skip your profile in the first 6 seconds.",
  },
  {
    icon: PenLine,
    title: "AI Rewrite Engine",
    description:
      "Rewrite suggestions tuned for FAANG, startup, or internship targets.",
  },
  {
    icon: Share2,
    title: "Shareable Scorecard",
    description:
      "Download and share your recruiter report with mentors or career coaches.",
  },
]

export function FeaturesSection() {
  return (
    <section className="px-6 py-[120px]">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <h2 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
            Built like a recruiter thinks
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Every signal mapped to what actually moves shortlist decisions.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ scale: 1.02 }}
              className="glass-card group rounded-2xl p-6 transition-shadow hover:shadow-lg hover:shadow-indigo-500/5"
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400 transition-colors group-hover:from-indigo-500/30 group-hover:to-purple-500/30">
                <feature.icon className="size-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-zinc-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
