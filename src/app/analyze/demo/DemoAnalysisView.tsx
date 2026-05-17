"use client"

import { AnalysisDashboard } from "@/components/dashboard/AnalysisDashboard"
import { DEMO_ANALYSIS } from "@/lib/demo-analysis"

export function DemoAnalysisView() {
  return <AnalysisDashboard result={DEMO_ANALYSIS} />
}
