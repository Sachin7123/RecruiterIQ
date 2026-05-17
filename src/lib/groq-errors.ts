export const GROQ_RATE_LIMIT_MESSAGE =
  "Our AI is getting a lot of requests right now. Please try again in 30 seconds."

export class GroqRateLimitError extends Error {
  constructor(message = GROQ_RATE_LIMIT_MESSAGE) {
    super(message)
    this.name = "GroqRateLimitError"
  }
}

export function isGroqRateLimitError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false
  const err = error as { status?: number; statusCode?: number }
  return err.status === 429 || err.statusCode === 429
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Retry once after 2s on Groq 429; throw GroqRateLimitError if still rate-limited. */
export async function withGroqRetry<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    if (!isGroqRateLimitError(error)) throw error
    await sleep(2000)
    try {
      return await fn()
    } catch (retryError) {
      if (isGroqRateLimitError(retryError)) {
        throw new GroqRateLimitError()
      }
      throw retryError
    }
  }
}
