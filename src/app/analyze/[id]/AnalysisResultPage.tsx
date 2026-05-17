"use client"

import { motion } from "framer-motion"
import { useCallback, useEffect, useState } from "react"
import { AnalysisDashboard } from "@/components/dashboard/AnalysisDashboard"
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton"
import { ErrorState } from "@/components/shared/ErrorState"
import { loadAnalysisFromStorage, saveAnalysisToStorage } from "@/lib/analysis-storage"
import type { AnalysisResult } from "@/types"

const MIN_SKELETON_MS = 300
const POLL_INTERVAL_MS = 2000
const MAX_POLL_MS = 90_000

type LoadState = "loading" | "processing" | "ready" | "failed" | "not_found"

type AnalysisResultPageProps = {
  analysisId: string
}

export function AnalysisResultPage({ analysisId }: AnalysisResultPageProps) {
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loadState, setLoadState] = useState<LoadState>("loading")
  const [statusMessage, setStatusMessage] = useState("Loading your report…")

  const fetchReport = useCallback(async (): Promise<LoadState> => {
    const cached = loadAnalysisFromStorage(analysisId)
    if (cached) {
      setResult(cached)
      return "ready"
    }

    try {
      const res = await fetch(`/api/analyze/${analysisId}`)

      if (res.status === 202) {
        return "processing"
      }

      if (res.status === 422) {
        return "failed"
      }

      if (res.ok) {
        const data = (await res.json()) as AnalysisResult
        saveAnalysisToStorage(data)
        setResult(data)
        return "ready"
      }
    } catch {
      // network error — fall through to not_found if no cache
    }

    return loadAnalysisFromStorage(analysisId) ? "ready" : "not_found"
  }, [analysisId])

  useEffect(() => {
    let cancelled = false
    const pollStart = Date.now()

    async function run() {
      setLoadState("loading")
      setStatusMessage("Loading your report…")
      const start = Date.now()

      let state = await fetchReport()
      const elapsed = Date.now() - start
      const remaining = Math.max(0, MIN_SKELETON_MS - elapsed)
      if (remaining > 0) {
        await new Promise((resolve) => setTimeout(resolve, remaining))
      }

      while (state === "processing" && Date.now() - pollStart < MAX_POLL_MS) {
        if (cancelled) return
        setLoadState("processing")
        setStatusMessage("Still analyzing your profile…")
        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS))
        if (cancelled) return
        state = await fetchReport()
      }

      if (cancelled) return

      if (state === "ready") {
        setLoadState("ready")
        return
      }

      if (state === "processing") {
        setLoadState("failed")
        setStatusMessage("")
        return
      }

      setLoadState(state)
    }

    run()
    return () => {
      cancelled = true
    }
  }, [analysisId, fetchReport])

  if (loadState === "loading" || loadState === "processing") {
    return (
      <motion.div className="min-h-[60vh]">
        <p className="mb-6 text-center text-sm text-zinc-500">{statusMessage}</p>
        <DashboardSkeleton />
      </motion.div>
    )
  }

  if (loadState === "failed") {
    return (
      <ErrorState
        title="Analysis failed"
        message="Something went wrong while analyzing your PDF — Groq may be busy or the file couldn't be processed. Try uploading again."
        href="/analyze"
        hrefLabel="Upload again"
      />
    )
  }

  if (loadState === "not_found" || !result) {
    return (
      <ErrorState
        title="Report not found"
        message="This analysis may have expired or the ID is invalid. Upload your LinkedIn PDF again to generate a new report."
        href="/analyze"
        hrefLabel="Upload profile"
      />
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <AnalysisDashboard result={result} />
    </motion.div>
  )
}
