"use client"

import { motion } from "framer-motion"
import { CheckCircle, ListOrdered, XCircle } from "lucide-react"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { itemVariants } from "@/lib/motion-variants"
import type { RecruiterAnalysis } from "@/types"

type RecruiterInsightsCardProps = {
  analysis: RecruiterAnalysis
}

export function RecruiterInsightsCard({ analysis }: RecruiterInsightsCardProps) {
  const [tab, setTab] = useState("strengths")

  return (
    <motion.div variants={itemVariants} className="card-hover glass-card rounded-3xl p-6">
      <h2 className="text-lg font-semibold text-white">Recruiter insights</h2>

      <Tabs value={tab} onValueChange={setTab} className="mt-4">
        <TabsList
          variant="line"
          className="w-full justify-start gap-4 border-b border-white/10 bg-transparent p-0"
        >
          <TabsTrigger
            value="strengths"
            className="rounded-none px-0 pb-3 data-active:text-emerald-400"
          >
            Strengths
          </TabsTrigger>
          <TabsTrigger
            value="weaknesses"
            className="rounded-none px-0 pb-3 data-active:text-red-400"
          >
            Weaknesses
          </TabsTrigger>
          <TabsTrigger
            value="priorities"
            className="rounded-none px-0 pb-3 data-active:text-indigo-400"
          >
            Improvement Priorities
          </TabsTrigger>
        </TabsList>

          <TabsContent value="strengths" className="mt-4 outline-none">
            <ul className="space-y-3">
              {analysis.strengths.filter(Boolean).slice(0, 3).map((item) => (
                <li
                  key={item}
                  className="flex gap-3 rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-4"
                >
                  <CheckCircle className="mt-0.5 size-5 shrink-0 text-emerald-400" />
                  <span className="text-sm leading-relaxed text-zinc-300">{item}</span>
                </li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="weaknesses" className="mt-4 outline-none">
            <ul className="space-y-3">
              {analysis.weaknesses.filter(Boolean).slice(0, 5).map((item) => (
                <li
                  key={item}
                  className="flex gap-3 rounded-xl border border-red-500/25 bg-red-500/10 p-4"
                >
                  <XCircle className="mt-0.5 size-5 shrink-0 text-red-400" />
                  <span className="text-sm font-medium leading-relaxed text-red-100/90">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="priorities" className="mt-4 outline-none">
            <ol className="space-y-4">
              {analysis.improvementPriorities.filter(Boolean).slice(0, 3).map((item, i) => (
                <li
                  key={item}
                  className="rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex gap-3">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-sm font-bold text-indigo-300">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-white">{item}</p>
                      <p className="mt-1 text-xs text-zinc-500">Fix in: ~30 mins</p>
                      <button
                        type="button"
                        className="mt-3 text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
                        onClick={() => {
                          document
                            .getElementById("rewrite-engine")
                            ?.scrollIntoView({ behavior: "smooth" })
                        }}
                      >
                        Rewrite with AI →
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </TabsContent>
      </Tabs>
    </motion.div>
  )
}
