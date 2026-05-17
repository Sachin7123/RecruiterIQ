"use client"

import { motion } from "framer-motion"
import { GradientButton } from "@/components/shared/GradientButton"

export function FinalCTASection() {
  return (
    <section className="px-6 py-[120px]">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-4xl"
      >
        <motion.div
          className="relative overflow-hidden rounded-3xl p-[1px]"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-80" />
          <div className="relative rounded-[calc(1.5rem-1px)] bg-[#0a0a0a] px-8 py-16 text-center md:px-16 md:py-20">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.12),transparent_70%)]" />
            <div className="relative">
              <h2 className="font-display text-3xl font-bold tracking-tight text-white md:text-5xl">
                Stop guessing why you&apos;re not getting shortlisted.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-400">
                Join 1,000+ candidates who improved their shortlist rate
              </p>
              <motion.div className="mt-10 flex justify-center">
                <GradientButton href="/analyze" size="lg">
                  Analyze My Profile →
                </GradientButton>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
