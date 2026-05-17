import Groq from "groq-sdk"

export const groqClient = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
})

export const MODELS = {
  primary: "llama-3.3-70b-versatile",
  fast: "llama-3.1-8b-instant",
} as const

export function assertGroqConfigured() {
  if (!process.env.GROQ_API_KEY?.trim()) {
    throw new Error("GROQ_API_KEY is not configured in .env.local")
  }
}
