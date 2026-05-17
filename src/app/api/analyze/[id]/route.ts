import { NextResponse } from "next/server"
import { assertSupabaseConfigured, supabaseAdmin } from "@/lib/supabase"
import type { AnalysisResult } from "@/types"

export const runtime = "nodejs"

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    assertSupabaseConfigured()
    const { id } = await context.params

    const { data, error } = await supabaseAdmin
      .from("analyses")
      .select("analysis_result, status")
      .eq("id", id)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: "Analysis not found", status: "not_found" }, { status: 404 })
    }

    if (data.status === "processing" || data.status === "pending") {
      return NextResponse.json(
        { status: "processing", message: "Analysis is still running." },
        { status: 202 }
      )
    }

    if (data.status === "failed") {
      return NextResponse.json(
        {
          status: "failed",
          error: "Analysis failed. Upload your PDF again to retry.",
        },
        { status: 422 }
      )
    }

    if (data.status !== "completed" || !data.analysis_result) {
      return NextResponse.json(
        { status: "processing", message: "Analysis is still running." },
        { status: 202 }
      )
    }

    return NextResponse.json(data.analysis_result as AnalysisResult)
  } catch (error) {
    console.error("[analyze GET] error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load analysis" },
      { status: 500 }
    )
  }
}
