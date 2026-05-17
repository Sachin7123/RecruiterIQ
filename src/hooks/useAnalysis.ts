"use client"

import { useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import { saveAnalysisToStorage } from "@/lib/analysis-storage"
import type { AnalysisResult } from "@/types"

export type AnalysisStatus =
  | "idle"
  | "uploading"
  | "analyzing"
  | "done"
  | "error"

const STATUS_MESSAGES = [
  "Extracting your profile data...",
  "Running recruiter scoring engine...",
  "Simulating recruiter psychology...",
  "Generating your personalized report...",
] as const

export function useAnalysis() {
  const router = useRouter()
  const [status, setStatus] = useState<AnalysisStatus>("idle")
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string>(STATUS_MESSAGES[0])
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const messageTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTimers = useCallback(() => {
    if (progressTimer.current) clearInterval(progressTimer.current)
    if (messageTimer.current) clearInterval(messageTimer.current)
    progressTimer.current = null
    messageTimer.current = null
  }, [])

  useEffect(() => () => clearTimers(), [clearTimers])

  const startProgressSimulation = useCallback(() => {
    clearTimers()
    let messageIndex = 0
    setStatusMessage(STATUS_MESSAGES[0])

    messageTimer.current = setInterval(() => {
      messageIndex = (messageIndex + 1) % STATUS_MESSAGES.length
      setStatusMessage(STATUS_MESSAGES[messageIndex])
    }, 2800)

    progressTimer.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 92) return p
        return p + Math.random() * 4
      })
    }, 400)
  }, [clearTimers])

  const analyze = useCallback(
    async (file: File) => {
      clearTimers()
      setError(null)
      setResult(null)
      setProgress(5)
      setStatus("uploading")

      try {
        const formData = new FormData()
        formData.append("file", file)

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        const uploadJson = await uploadRes.json()

        if (!uploadRes.ok) {
          throw new Error(uploadJson.error ?? "Upload failed")
        }

        const { uploadPath, analysisId } = uploadJson as {
          uploadPath: string
          analysisId: string
        }

        setProgress(25)
        setStatus("analyzing")
        startProgressSimulation()

        const analyzeRes = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ analysisId, uploadPath }),
        })

        const analyzeJson = await analyzeRes.json()

        if (!analyzeRes.ok) {
          throw new Error(analyzeJson.error ?? "Analysis failed")
        }

        const analysisResult = analyzeJson as AnalysisResult

        clearTimers()
        setProgress(100)
        setStatus("done")
        setResult(analysisResult)
        saveAnalysisToStorage(analysisResult)
        router.push(`/analyze/${analysisId}`)
      } catch (err) {
        clearTimers()
        setStatus("error")
        setProgress(0)
        setError(err instanceof Error ? err.message : "Something went wrong")
      }
    },
    [clearTimers, router, startProgressSimulation]
  )

  const reset = useCallback(() => {
    clearTimers()
    setStatus("idle")
    setResult(null)
    setProgress(0)
    setError(null)
    setStatusMessage(STATUS_MESSAGES[0])
  }, [clearTimers])

  return {
    status,
    result,
    progress,
    error,
    statusMessage,
    analyze,
    reset,
  }
}
