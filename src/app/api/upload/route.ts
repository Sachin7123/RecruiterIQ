import { randomUUID } from "crypto"
import { NextResponse } from "next/server"
import {
  getCookieCount,
  UPLOAD_COOKIE_MAX_AGE,
  UPLOAD_COOKIE_NAME,
  UPLOAD_RATE_LIMIT,
} from "@/lib/rate-limit"
import { assertSupabaseConfigured, PDF_BUCKET, supabaseAdmin } from "@/lib/supabase"
import { ALLOWED_PDF_MIME, MAX_PDF_BYTES } from "@/lib/validations"

export const runtime = "nodejs"
export const maxDuration = 30

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

export async function POST(request: Request) {
  try {
    assertSupabaseConfigured()

    const cookieHeader = request.headers.get("cookie")
    const uploadCount = getCookieCount(cookieHeader, UPLOAD_COOKIE_NAME)

    if (uploadCount >= UPLOAD_RATE_LIMIT) {
      return jsonError(
        `Upload limit reached (${UPLOAD_RATE_LIMIT} PDFs per hour). Try again later.`,
        429
      )
    }

    const formData = await request.formData()
    const file = formData.get("file")

    if (!file || !(file instanceof File)) {
      return jsonError("No file provided. Use form field 'file'.", 400)
    }

    if (file.size === 0) {
      return jsonError("File is empty.", 400)
    }

    if (file.size > MAX_PDF_BYTES) {
      return jsonError("File exceeds 10MB limit.", 400)
    }

    const mime = file.type || "application/octet-stream"
    const isPdfMime = mime === ALLOWED_PDF_MIME
    const isPdfName = file.name.toLowerCase().endsWith(".pdf")

    if (!isPdfMime && !isPdfName) {
      return jsonError("Only PDF files are accepted.", 400)
    }

    if (!isPdfMime && isPdfName) {
      // Allow extension fallback when browser omits MIME
    } else if (!isPdfMime) {
      return jsonError("Invalid file type. Expected application/pdf.", 400)
    }

    const analysisId = randomUUID()
    const uploadPath = `${analysisId}.pdf`
    const buffer = Buffer.from(await file.arrayBuffer())

    const { error: uploadError } = await supabaseAdmin.storage
      .from(PDF_BUCKET)
      .upload(uploadPath, buffer, {
        contentType: ALLOWED_PDF_MIME,
        upsert: false,
      })

    if (uploadError) {
      console.error("[upload] storage error:", uploadError)
      return jsonError("Failed to upload PDF to storage.", 500)
    }

    const { error: insertError } = await supabaseAdmin.from("analyses").insert({
      id: analysisId,
      pdf_path: uploadPath,
      status: "pending",
    })

    if (insertError) {
      await supabaseAdmin.storage.from(PDF_BUCKET).remove([uploadPath])
      console.error("[upload] db insert error:", insertError)
      return jsonError("Failed to create analysis record.", 500)
    }

    const response = NextResponse.json({ uploadPath, analysisId })
    response.cookies.set(UPLOAD_COOKIE_NAME, String(uploadCount + 1), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: UPLOAD_COOKIE_MAX_AGE,
      path: "/",
    })
    return response
  } catch (error) {
    console.error("[upload] unexpected error:", error)
    return jsonError("Upload failed.", 500)
  }
}
