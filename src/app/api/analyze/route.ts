import { NextResponse } from "next/server"
import { assertGroqConfigured } from "@/lib/groq"
import { GroqRateLimitError } from "@/lib/groq-errors"
import { assertSupabaseConfigured, PDF_BUCKET, supabaseAdmin } from "@/lib/supabase"
import { analyzeRequestSchema } from "@/lib/validations"
import { analyzeWithAI, mergeAnalysis } from "@/services/ai-recruiter"
import {
  extractTextFromPDF,
  parseProfileSections,
} from "@/services/pdf-parser"
import { scoreProfile } from "@/services/scoring-engine"
import type { AnalysisResult } from "@/types"

export const runtime = "nodejs"
export const maxDuration = 60

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

async function markAnalysisFailed(analysisId: string) {
  try {
    await supabaseAdmin
      .from("analyses")
      .update({ status: "failed" })
      .eq("id", analysisId)
  } catch (e) {
    console.error("[analyze] failed to mark analysis failed:", e)
  }
}

export async function POST(request: Request) {
  let analysisId: string | undefined

  try {
    assertSupabaseConfigured()
    assertGroqConfigured()

    const body = await request.json()
    const parsed = analyzeRequestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const parsedData = parsed.data
    analysisId = parsedData.analysisId
    const { uploadPath } = parsedData

    const { data: row, error: fetchError } = await supabaseAdmin
      .from("analyses")
      .select("id, pdf_path, status")
      .eq("id", analysisId)
      .single()

    if (fetchError || !row) {
      return jsonError("Analysis not found.", 404)
    }

    if (row.pdf_path !== uploadPath) {
      return jsonError("Upload path does not match analysis record.", 400)
    }

    await supabaseAdmin
      .from("analyses")
      .update({ status: "processing" })
      .eq("id", analysisId)

    const { data: fileData, error: downloadError } = await supabaseAdmin.storage
      .from(PDF_BUCKET)
      .download(uploadPath)

    if (downloadError || !fileData) {
      console.error("[analyze] download error:", downloadError)
      await supabaseAdmin
        .from("analyses")
        .update({ status: "failed" })
        .eq("id", analysisId)
      return jsonError("Failed to download PDF from storage.", 500)
    }

    const buffer = Buffer.from(await fileData.arrayBuffer())
    const rawText = await extractTextFromPDF(buffer)
    const profile = parseProfileSections(rawText)

    if (process.env.NODE_ENV === "development") {
      console.log("[analyze] parsed ProfileData:", JSON.stringify(profile, null, 2))
    }

    const scoring = scoreProfile(profile)
    const commentary = await analyzeWithAI(profile, scoring.sectionScores)
    const analysis = mergeAnalysis(scoring, commentary)

    const result: AnalysisResult = {
      profile,
      analysis,
      analysisId,
      createdAt: new Date().toISOString(),
    }

    if (process.env.NODE_ENV === "development") {
      console.log("[analyze] full AnalysisResult:", JSON.stringify(result, null, 2))
    }

    const { error: updateError } = await supabaseAdmin
      .from("analyses")
      .update({
        raw_text: rawText,
        profile_data: profile,
        analysis_result: result,
        status: "completed",
      })
      .eq("id", analysisId)

    if (updateError) {
      console.error("[analyze] update error:", updateError)
      await markAnalysisFailed(analysisId)
      return jsonError("Failed to save analysis results.", 500)
    }

    return NextResponse.json(result)
  } catch (error) {
    if (analysisId) {
      await markAnalysisFailed(analysisId)
    }
    if (error instanceof GroqRateLimitError) {
      return jsonError(error.message, 429)
    }
    console.error("[analyze] unexpected error:", error)
    return jsonError(
      error instanceof Error ? error.message : "Analysis failed.",
      500
    )
  }
}
