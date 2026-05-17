import { z } from "zod"

export const analyzeRequestSchema = z.object({
  analysisId: z.string().uuid(),
  uploadPath: z.string().min(1),
})

export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>

export const MAX_PDF_BYTES = 10 * 1024 * 1024
export const ALLOWED_PDF_MIME = "application/pdf"
