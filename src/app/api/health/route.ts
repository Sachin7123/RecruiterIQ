import { NextResponse } from "next/server"
import { groqClient, MODELS, assertGroqConfigured } from "@/lib/groq"
import { assertSupabaseConfigured, supabaseAdmin } from "@/lib/supabase"

export const runtime = "nodejs"

export async function GET() {
  const checks: Record<string, { ok: boolean; detail?: string }> = {}

  try {
    assertGroqConfigured()
    const completion = await groqClient.chat.completions.create({
      model: MODELS.primary,
      max_tokens: 8,
      messages: [{ role: "user", content: "Reply with OK only." }],
    })
    const text = completion.choices[0]?.message?.content?.trim() ?? ""
    checks.groq = { ok: Boolean(text), detail: MODELS.primary }
  } catch (error) {
    checks.groq = {
      ok: false,
      detail: error instanceof Error ? error.message : "Groq unreachable",
    }
  }

  try {
    assertSupabaseConfigured()
    const { error } = await supabaseAdmin.from("analyses").select("id").limit(1)
    checks.supabase = { ok: !error, detail: error?.message }
  } catch (error) {
    checks.supabase = {
      ok: false,
      detail: error instanceof Error ? error.message : "Supabase unreachable",
    }
  }

  const healthy = Object.values(checks).every((c) => c.ok)

  return NextResponse.json(
    {
      status: healthy ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      checks,
    },
    { status: healthy ? 200 : 503 }
  )
}
