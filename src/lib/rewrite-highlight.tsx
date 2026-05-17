import type { ReactNode } from "react"
import { GENERIC_PHRASES } from "@/lib/rewrite-constants"

export function highlightGenericPhrases(text: string): ReactNode[] {
  if (!text) return [text]

  const pattern = new RegExp(
    `(${GENERIC_PHRASES.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "gi"
  )

  const parts = text.split(pattern)
  return parts.map((part, i) => {
    const isGeneric = GENERIC_PHRASES.some(
      (p) => p.toLowerCase() === part.toLowerCase()
    )
    if (isGeneric) {
      return (
        <mark
          key={i}
          className="rounded bg-red-500/25 px-0.5 text-red-200"
        >
          {part}
        </mark>
      )
    }
    return <span key={i}>{part}</span>
  })
}

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[\s,.;:!?()\-–—/]+/)
    .filter((t) => t.length > 2)
}

export function getAddedWords(original: string, rewritten: string): Set<string> {
  const originalTokens = new Set(tokenize(original))
  const added = new Set<string>()

  for (const token of tokenize(rewritten)) {
    if (!originalTokens.has(token)) added.add(token)
  }

  return added
}

export function highlightAddedWords(
  text: string,
  addedWords: Set<string>
): ReactNode[] {
  if (!text || addedWords.size === 0) return [text]

  const words = text.split(/(\s+)/)
  return words.map((word, i) => {
    const clean = word.toLowerCase().replace(/[^a-z0-9+#.]/gi, "")
    if (clean && addedWords.has(clean)) {
      return (
        <mark
          key={i}
          className="rounded bg-emerald-500/20 px-0.5 text-emerald-200"
        >
          {word}
        </mark>
      )
    }
    return <span key={i}>{word}</span>
  })
}
