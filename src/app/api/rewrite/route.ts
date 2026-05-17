import { NextResponse } from "next/server"
import { assertGroqConfigured } from "@/lib/groq"
import { GroqRateLimitError } from "@/lib/groq-errors"
import { REWRITE_COOKIE_NAME, REWRITE_RATE_LIMIT } from "@/lib/rewrite-constants"
import { rewriteRequestSchema } from "@/lib/rewrite-validations"
import { rewriteSection } from "@/services/rewrite-engine"

export const runtime = "nodejs"
export const maxDuration = 30

function getRewriteCount(cookieHeader: string | null): number {
  if (!cookieHeader) return 0
  const match = cookieHeader.match(
    new RegExp(`${REWRITE_COOKIE_NAME}=(\\d+)`)
  )
  return match ? parseInt(match[1], 10) : 0
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

export async function POST(request: Request) {
  try {
    assertGroqConfigured()

    const cookieHeader = request.headers.get("cookie")
    const currentCount = getRewriteCount(cookieHeader)

    if (currentCount >= REWRITE_RATE_LIMIT) {
      return jsonError(
        `Rate limit reached (${REWRITE_RATE_LIMIT} rewrites per session). Try again later.`,
        429
      )
    }

    const body = await request.json()
    const parsed = rewriteRequestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { section, original, profileData, mode } = parsed.data

    const result = await rewriteSection(
      section,
      original,
      profileData,
      mode
    )

    const response = NextResponse.json({
      ...result,
      remaining: REWRITE_RATE_LIMIT - currentCount - 1,
    })

    response.cookies.set(REWRITE_COOKIE_NAME, String(currentCount + 1), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    })

    return response
  } catch (error) {
    if (error instanceof GroqRateLimitError) {
      return jsonError(error.message, 429)
    }
    console.error("[rewrite] error:", error)
    return jsonError(
      error instanceof Error ? error.message : "Rewrite failed.",
      500
    )
  }
}
