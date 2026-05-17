"use client"

import { motion } from "framer-motion"
import { ExternalLink, GitBranch, Mail, MapPin } from "lucide-react"
import { itemVariants } from "@/lib/motion-variants"
import type { ProfileData } from "@/types"

type CandidateSummaryCardProps = {
  profile: ProfileData
  profileSummary: string
}

export function CandidateSummaryCard({
  profile,
  profileSummary,
}: CandidateSummaryCardProps) {
  const { contactInfo } = profile

  return (
    <motion.div variants={itemVariants} className="card-hover glass-card rounded-3xl p-6">
      <p className="text-xs font-medium uppercase tracking-wider text-indigo-400">
        Candidate
      </p>
      <h2 className="font-display mt-2 text-2xl font-bold text-white">
        {contactInfo.name || "Unknown"}
      </h2>
      {profile.headline && (
        <p className="mt-2 break-words text-sm leading-relaxed text-zinc-400">
          {profile.headline}
        </p>
      )}
      <p className="mt-4 text-sm text-zinc-500">{profileSummary}</p>

      <ul className="mt-5 space-y-2.5 text-sm text-zinc-400">
        {contactInfo.location && (
          <li className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0 text-zinc-500" />
            {contactInfo.location}
          </li>
        )}
        {contactInfo.email && (
          <li className="flex items-center gap-2 break-all">
            <Mail className="size-4 shrink-0 text-zinc-500" />
            {contactInfo.email}
          </li>
        )}
        {contactInfo.linkedinUrl && (
          <li className="flex items-center gap-2 break-all">
            <ExternalLink className="size-4 shrink-0 text-zinc-500" />
            <a
              href={contactInfo.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:underline"
            >
              LinkedIn
            </a>
          </li>
        )}
        {contactInfo.githubUrl && (
          <li className="flex items-center gap-2 break-all">
            <GitBranch className="size-4 shrink-0 text-zinc-500" />
            <a
              href={contactInfo.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:underline"
            >
              GitHub
            </a>
          </li>
        )}
      </ul>

      <div className="mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-5">
        <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-zinc-400">
          {profile.experience.length} roles
        </span>
        <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-zinc-400">
          {profile.skills.length} skills
        </span>
        <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-zinc-400">
          {profile.projects.length} projects
        </span>
      </div>
    </motion.div>
  )
}
