import type { AnalysisResult } from "@/types"

const storageKey = (id: string) => `analysis_${id}`

export function saveAnalysisToStorage(result: AnalysisResult): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(storageKey(result.analysisId), JSON.stringify(result))
  } catch (error) {
    console.warn("[analysis-storage] Failed to save:", error)
  }
}

export function loadAnalysisFromStorage(id: string): AnalysisResult | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(storageKey(id))
    if (!raw) return null
    return JSON.parse(raw) as AnalysisResult
  } catch {
    return null
  }
}
