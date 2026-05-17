"use client"

import Link from "next/link"
import { AlertCircle, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

type ErrorStateProps = {
  title: string
  message: string
  onRetry?: () => void
  retryLabel?: string
  href?: string
  hrefLabel?: string
  className?: string
}

export function ErrorState({
  title,
  message,
  onRetry,
  retryLabel = "Try again",
  href,
  hrefLabel = "Go back",
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "glass-card rounded-2xl border border-red-500/25 bg-red-500/5 p-8 text-center",
        className
      )}
    >
      <AlertCircle className="mx-auto size-10 text-red-400" />
      <h2 className="mt-4 font-display text-xl font-bold text-white">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">{message}</p>
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-5 text-sm font-medium text-white transition-transform active:scale-[0.97]"
          >
            <RotateCcw className="size-4" />
            {retryLabel}
          </button>
        )}
        {href && (
          <Link
            href={href}
            className="inline-flex h-10 items-center justify-center rounded-lg border border-white/15 px-5 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/5 active:scale-[0.97]"
          >
            {hrefLabel}
          </Link>
        )}
      </div>
    </div>
  )
}
