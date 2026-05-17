"use client"

import { motion } from "framer-motion"
import { PenLine } from "lucide-react"
import { useState } from "react"
import { RewriteSectionPanel } from "@/components/dashboard/RewriteSectionPanel"
import { cn } from "@/lib/utils"
import { itemVariants } from "@/lib/motion-variants"
import type { ProfileData } from "@/types"

type RewriteEngineCardProps = {
  profile: ProfileData
}

export function RewriteEngineCard({ profile }: RewriteEngineCardProps) {
  const [draftProfile, setDraftProfile] = useState(profile)
  const [appliedHint, setAppliedHint] = useState<string | null>(null)
  const [mobileTab, setMobileTab] = useState<"headline" | "about">("headline")

  function handleApply(section: "headline" | "about", text: string) {
    setDraftProfile((prev) =>
      section === "headline" ? { ...prev, headline: text } : { ...prev, about: text }
    )
    setAppliedHint(
      `${section === "headline" ? "Headline" : "About"} updated locally. Re-upload your PDF to refresh your scorecard.`
    )
  }

  return (
    <motion.div
      id="rewrite-engine"
      variants={itemVariants}
      className="card-hover glass-card relative mt-6 overflow-hidden rounded-3xl p-6"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />

      <div className="relative">
        <div className="flex items-center gap-2">
          <PenLine className="size-5 text-indigo-400" />
          <h2 className="text-lg font-semibold text-white">AI Rewrite Engine</h2>
        </div>
        <p className="mt-2 text-sm text-zinc-400">
          Rewrite for startup, FAANG, recruiter scan, or internship — with ATS keywords
          baked in.
        </p>

        {appliedHint && (
          <p className="mt-3 rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-3 py-2 text-xs text-indigo-200">
            {appliedHint}
          </p>
        )}

        <div className="mt-4 flex gap-2 lg:hidden">
          {(["headline", "about"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setMobileTab(tab)}
              className={cn(
                "flex-1 rounded-lg py-2 text-sm font-medium capitalize transition-colors",
                mobileTab === tab
                  ? "bg-indigo-500/20 text-indigo-300"
                  : "bg-white/5 text-zinc-500"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-4 hidden gap-4 lg:grid lg:grid-cols-2">
          <RewriteSectionPanel
            section="headline"
            title="Headline"
            placeholder="Your LinkedIn headline..."
            rows={2}
            initialText={draftProfile.headline}
            profile={draftProfile}
            onApply={(text) => handleApply("headline", text)}
          />
          <RewriteSectionPanel
            section="about"
            title="About"
            placeholder="Your about section..."
            rows={5}
            initialText={draftProfile.about}
            profile={draftProfile}
            onApply={(text) => handleApply("about", text)}
          />
        </div>

        <div className="mt-4 lg:hidden">
          {mobileTab === "headline" ? (
            <RewriteSectionPanel
              section="headline"
              title="Headline"
              placeholder="Your LinkedIn headline..."
              rows={2}
              initialText={draftProfile.headline}
              profile={draftProfile}
              onApply={(text) => handleApply("headline", text)}
            />
          ) : (
            <RewriteSectionPanel
              section="about"
              title="About"
              placeholder="Your about section..."
              rows={5}
              initialText={draftProfile.about}
              profile={draftProfile}
              onApply={(text) => handleApply("about", text)}
            />
          )}
        </div>
      </div>
    </motion.div>
  )
}
