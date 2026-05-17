"use client"

import { useCallback, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { toPng } from "html-to-image"
import { motion } from "framer-motion"
import { Check, Download, Link2, Share2 } from "lucide-react"
import { toast } from "sonner"
import { getScorePercent } from "@/lib/dashboard-utils"
import { getSiteUrl, SITE_AUTHOR, SITE_PRODUCT } from "@/lib/site-config"
import { itemVariants } from "@/lib/motion-variants"
import type { AnalysisResult, SectionScore } from "@/types"

const EXPORT_SECTIONS = [
  "Headline",
  "Experience",
  "Projects",
  "ATS Keywords",
  "Personal Branding",
] as const

const CARD_WIDTH = 1200
const CARD_HEIGHT = 630
const PREVIEW_SCALE = 0.22
const PREVIEW_W = Math.round(CARD_WIDTH * PREVIEW_SCALE)
const PREVIEW_H = Math.round(CARD_HEIGHT * PREVIEW_SCALE)

function getScorecardLabel(score: number): string {
  if (score >= 75) return "Strong Profile"
  if (score >= 60) return "Above Average Profile"
  if (score >= 50) return "Average Profile"
  return "Needs Improvement"
}

type ScorecardVisualProps = {
  name: string
  headline: string
  score: number
  scoreLabel: string
  date: string
  sections: SectionScore[]
  strengths: string[]
  concerns: string[]
}

function ScorecardVisual({
  name,
  headline,
  score,
  scoreLabel,
  date,
  sections,
  strengths,
  concerns,
}: ScorecardVisualProps) {
  return (
    <div
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRadius: 16,
        border: "1px solid rgba(99, 102, 241, 0.3)",
        padding: 40,
        color: "#ffffff",
        background: "linear-gradient(135deg, #0f0f23 0%, #1a1a3e 100%)",
        fontFamily:
          'var(--font-inter), system-ui, -apple-system, "Segoe UI", sans-serif',
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontSize: 28,
              fontWeight: 700,
              fontFamily: 'var(--font-syne), system-ui, sans-serif',
            }}
          >
            RecruiterIQ
          </span>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: "#6366f1",
            }}
          />
        </div>
        <span style={{ fontSize: 14, color: "#a1a1aa" }}>{date}</span>
      </div>

      <div style={{ marginTop: 24 }}>
        <p style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>{name}</p>
        <p
          style={{
            marginTop: 4,
            fontSize: 18,
            color: "#a1a1aa",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: 900,
          }}
        >
          {headline}
        </p>
      </div>

      <div style={{ marginTop: 32, display: "flex", alignItems: "flex-end", gap: 40 }}>
        <div>
          <p
            style={{
              fontSize: 96,
              fontWeight: 700,
              lineHeight: 1,
              margin: 0,
              color: "#a78bfa",
            }}
          >
            {score}
            <span style={{ fontSize: 36, color: "#71717a" }}>/100</span>
          </p>
          <p style={{ marginTop: 8, fontSize: 20, color: "#a5b4fc" }}>{scoreLabel}</p>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
          {sections.map((section) => {
            const pct = getScorePercent(section)
            return (
              <div key={section.section}>
                <div
                  style={{
                    marginBottom: 4,
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 14,
                    color: "#d4d4d8",
                  }}
                >
                  <span>{section.section}</span>
                  <span>{pct}%</span>
                </div>
                <div
                  style={{
                    height: 8,
                    borderRadius: 9999,
                    backgroundColor: "rgba(255,255,255,0.1)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${pct}%`,
                      borderRadius: 9999,
                      background: "linear-gradient(90deg, #6366f1, #a855f7)",
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ marginTop: 32, display: "flex", flexWrap: "wrap", gap: 12 }}>
        {strengths.map((s) => (
          <span
            key={s}
            style={{
              borderRadius: 9999,
              border: "1px solid rgba(16, 185, 129, 0.4)",
              backgroundColor: "rgba(16, 185, 129, 0.15)",
              padding: "4px 12px",
              fontSize: 14,
              color: "#6ee7b7",
            }}
          >
            {s.length > 42 ? `${s.slice(0, 42)}…` : s}
          </span>
        ))}
        {concerns.map((c) => (
          <span
            key={c}
            style={{
              borderRadius: 9999,
              border: "1px solid rgba(248, 113, 113, 0.4)",
              backgroundColor: "rgba(239, 68, 68, 0.15)",
              padding: "4px 12px",
              fontSize: 14,
              color: "#fca5a5",
            }}
          >
            {c.length > 42 ? `${c.slice(0, 42)}…` : c}
          </span>
        ))}
      </div>

      <p style={{ marginTop: 24, textAlign: "center", fontSize: 14, color: "#71717a" }}>
        {SITE_PRODUCT.name} — {new URL(getSiteUrl()).host} · Built by {SITE_AUTHOR.name}
      </p>
    </div>
  )
}

function waitForPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  })
}

type ScorecardExportProps = {
  result: AnalysisResult
}

export function ScorecardExport({ result }: ScorecardExportProps) {
  const exportRef = useRef<HTMLDivElement>(null)
  const [capturing, setCapturing] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)

  const { profile, analysis, analysisId, createdAt } = result
  const scoreLabel = getScorecardLabel(analysis.overallScore)
  const displaySections = EXPORT_SECTIONS.map((name) =>
    analysis.sectionScores.find((s) => s.section === name)
  ).filter((s): s is SectionScore => Boolean(s))

  const strengths = analysis.strengths.filter(Boolean).slice(0, 3)
  const concerns = [...analysis.recruiterConcerns, ...analysis.weaknesses]
    .filter(Boolean)
    .slice(0, 2)

  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  const visualProps: ScorecardVisualProps = {
    name: profile.contactInfo.name || "Candidate",
    headline: profile.headline || "Professional profile",
    score: analysis.overallScore,
    scoreLabel,
    date: formattedDate,
    sections: displaySections,
    strengths,
    concerns,
  }

  const handleDownload = useCallback(async () => {
    setDownloading(true)
    setCapturing(true)

    try {
      await waitForPaint()
      const node = exportRef.current
      if (!node) {
        throw new Error("Export node not ready")
      }

      await document.fonts.ready

      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 2,
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        backgroundColor: "#0f0f23",
      })

      const link = document.createElement("a")
      link.download = "recruiteriq-scorecard.png"
      link.href = dataUrl
      link.click()
      toast.success("Scorecard downloaded")
    } catch (err) {
      console.error("[ScorecardExport]", err)
      toast.error("Failed to export image. Try again.")
    } finally {
      setCapturing(false)
      setDownloading(false)
    }
  }, [visualProps])

  async function handleShare() {
    const url = `${window.location.origin}/analyze/${analysisId}`
    try {
      await navigator.clipboard.writeText(url)
      setLinkCopied(true)
      toast.success("Report link copied to clipboard")
      setTimeout(() => setLinkCopied(false), 2000)
    } catch {
      toast.error("Could not copy link")
    }
  }

  const exportPortal =
    capturing && typeof document !== "undefined"
      ? createPortal(
          <div
            ref={exportRef}
            aria-hidden
            style={{
              position: "fixed",
              left: 0,
              top: 0,
              transform: "translateX(-10000px)",
              pointerEvents: "none",
            }}
          >
            <ScorecardVisual {...visualProps} />
          </div>,
          document.body
        )
      : null

  return (
    <motion.div variants={itemVariants} className="card-hover glass-card rounded-3xl p-6">
      {exportPortal}

      <div className="flex items-center gap-2">
        <Share2 className="size-5 text-purple-400" />
        <h2 className="text-lg font-semibold text-white">Share scorecard</h2>
      </div>
      <p className="mt-2 text-sm text-zinc-400">
        Download a 1200×630 share image or copy your report link.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={downloading}
          onClick={handleDownload}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-4 text-sm font-medium text-white transition-transform hover:opacity-90 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download className="size-4" />
          {downloading ? "Exporting…" : "Download Scorecard"}
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/15 px-4 text-sm font-medium text-zinc-300 hover:border-white/25 hover:bg-white/5 active:scale-[0.97]"
        >
          {linkCopied ? (
            <>
              <Check className="size-4 text-emerald-400" />
              Copied
            </>
          ) : (
            <>
              <Link2 className="size-4" />
              Share
            </>
          )}
        </button>
      </div>

      <div className="mt-6 rounded-xl border border-white/10 bg-black/40 p-3">
        <p className="mb-2 text-xs text-zinc-500">Preview</p>
        <div
          className="mx-auto overflow-hidden rounded-lg"
          style={{ width: PREVIEW_W, height: PREVIEW_H }}
        >
          <div
            style={{
              width: CARD_WIDTH,
              height: CARD_HEIGHT,
              transform: `scale(${PREVIEW_SCALE})`,
              transformOrigin: "top left",
            }}
          >
            <ScorecardVisual {...visualProps} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
