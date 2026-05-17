"use client"

import { PDFUploader } from "@/components/shared/PDFUploader"
import { ErrorState } from "@/components/shared/ErrorState"
import { useAnalysis } from "@/hooks/useAnalysis"

export function AnalyzePageClient() {
  const { status, progress, error, statusMessage, analyze, reset } =
    useAnalysis()

  const isUploadError = status === "error" && error

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-10 text-center sm:mb-12">
        <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          Upload your profile
        </h1>
        <p className="mt-4 text-base text-zinc-400 sm:text-lg">
          LinkedIn PDF export or resume. Recruiters will judge it in 6 seconds —
          we show you how.{" "}
          <a href="/analyze/demo" className="text-indigo-400 underline hover:text-indigo-300">
            Try the demo first
          </a>
          .
        </p>
      </div>

      {isUploadError ? (
        <ErrorState
          title="Analysis failed"
          message={error}
          onRetry={reset}
          retryLabel="Try again"
          href="/analyze"
          hrefLabel="Choose another file"
        />
      ) : (
        <PDFUploader
          status={status}
          progress={progress}
          statusMessage={statusMessage}
          error={error}
          onAnalyze={analyze}
          onReset={reset}
        />
      )}
    </div>
  )
}
