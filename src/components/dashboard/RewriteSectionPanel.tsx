"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Check, Copy, Loader2, Sparkles } from "lucide-react"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { ErrorState } from "@/components/shared/ErrorState"
import { Skeleton } from "@/components/ui/skeleton"
import {
  getAddedWords,
  highlightAddedWords,
  highlightGenericPhrases,
} from "@/lib/rewrite-highlight"
import { cn } from "@/lib/utils"
import type {
  ProfileData,
  RewriteMode,
  RewriteResult,
  RewriteSection,
} from "@/types"

const MODES: { id: RewriteMode; label: string }[] = [
  { id: "startup", label: "Startup" },
  { id: "faang", label: "FAANG" },
  { id: "recruiter", label: "Recruiter" },
  { id: "internship", label: "Internship" },
]

type RewriteSectionPanelProps = {
  section: RewriteSection
  title: string
  placeholder: string
  rows: number
  initialText: string
  profile: ProfileData
  onApply?: (text: string) => void
}

export function RewriteSectionPanel({
  section,
  title,
  placeholder,
  rows,
  initialText,
  profile,
  onApply,
}: RewriteSectionPanelProps) {
  const [text, setText] = useState(initialText)
  const [mode, setMode] = useState<RewriteMode>("recruiter")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<RewriteResult | null>(null)
  const [copied, setCopied] = useState(false)
  const [view, setView] = useState<"after" | "before">("after")
  const [remaining, setRemaining] = useState<number | null>(null)

  const addedWords = useMemo(() => {
    if (!result) return new Set<string>()
    return getAddedWords(result.original, result.rewritten)
  }, [result])

  async function handleGenerate() {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section,
          original: text,
          profileData: profile,
          mode,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error ?? "Rewrite failed")
      }

      setResult(data as RewriteResult)
      if (typeof data.remaining === "number") setRemaining(data.remaining)
      setView("after")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Rewrite failed")
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result.rewritten)
      setCopied(true)
      toast.success("Copied to clipboard")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Could not copy text")
    }
  }

  function handleUseThis() {
    if (!result) return
    setText(result.rewritten)
    onApply?.(result.rewritten)
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <h3 className="text-sm font-semibold text-white">{title}</h3>

      <label className="mt-3 block text-xs text-zinc-500">Current text</label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="mt-1.5 w-full resize-y rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
      />

      <p className="mt-4 text-xs font-medium text-zinc-500">Rewrite mode</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMode(m.id)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
              mode === m.id
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20"
                : "border border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:text-white"
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        disabled={loading || !text.trim()}
        onClick={handleGenerate}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Thinking like a recruiter...
          </>
        ) : (
          <>
            <Sparkles className="size-4" />
            Generate Rewrite
          </>
        )}
      </button>

      {remaining !== null && (
        <p className="mt-2 text-center text-xs text-zinc-600">
          {remaining} rewrites remaining this session
        </p>
      )}

      {error && (
        <div className="mt-4">
          <ErrorState
            title="Rewrite failed"
            message={error}
            onRetry={handleGenerate}
            retryLabel="Try again"
            className="p-5 text-left"
          />
        </div>
      )}

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-2 overflow-hidden"
          >
            <Skeleton className="h-4 w-full bg-white/10" />
            <Skeleton className="h-4 w-3/4 bg-white/10" />
            <Skeleton className="h-20 w-full bg-white/10" />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-medium uppercase tracking-wider text-emerald-400">
                Rewritten ({result.mode})
              </p>
              <div className="flex rounded-lg border border-white/10 p-0.5">
                <button
                  type="button"
                  onClick={() => setView("before")}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                    view === "before"
                      ? "bg-red-500/20 text-red-300"
                      : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  Before
                </button>
                <button
                  type="button"
                  onClick={() => setView("after")}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                    view === "after"
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  After
                </button>
              </div>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-zinc-200">
              {view === "before"
                ? highlightGenericPhrases(result.original)
                : highlightAddedWords(result.rewritten, addedWords)}
            </p>

            {result.keywords.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {result.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-300"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-4">
              <p className="text-xs font-medium text-zinc-500">
                Improvements made
              </p>
              <ul className="mt-2 space-y-1.5">
                {result.improvements.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-xs leading-relaxed text-zinc-400"
                  >
                    <span className="text-indigo-400">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-white/5"
              >
                {copied ? (
                  <>
                    <Check className="size-3.5 text-emerald-400" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" />
                    Copy
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleUseThis}
                className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/15"
              >
                Use This
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
