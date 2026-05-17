"use client"

import { AnimatePresence, motion } from "framer-motion"
import { AlertCircle, FileText, Loader2, Upload } from "lucide-react"
import { useCallback, useRef, useState } from "react"
import { Progress } from "@/components/ui/progress"
import type { AnalysisStatus } from "@/hooks/useAnalysis"
import { cn } from "@/lib/utils"
import { ALLOWED_PDF_MIME, MAX_PDF_BYTES } from "@/lib/validations"

type PDFUploaderProps = {
  status: AnalysisStatus
  progress: number
  statusMessage: string
  error: string | null
  onAnalyze: (file: File) => void
  onReset?: () => void
}

type ValidationError = "type" | "size" | null

export function PDFUploader({
  status,
  progress,
  statusMessage,
  error,
  onAnalyze,
  onReset,
}: PDFUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [validationError, setValidationError] = useState<ValidationError>(null)

  const isBusy = status === "uploading" || status === "analyzing"

  const validateFile = useCallback((candidate: File): ValidationError => {
    const isPdf =
      candidate.type === ALLOWED_PDF_MIME ||
      candidate.name.toLowerCase().endsWith(".pdf")
    if (!isPdf) return "type"
    if (candidate.size > MAX_PDF_BYTES) return "size"
    return null
  }, [])

  const handleFile = useCallback(
    (candidate: File | null) => {
      if (!candidate) return
      const err = validateFile(candidate)
      setValidationError(err)
      if (!err) setFile(candidate)
    },
    [validateFile]
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      const dropped = e.dataTransfer.files[0]
      if (dropped) handleFile(dropped)
    },
    [handleFile]
  )

  const validationMessage =
    validationError === "type"
      ? "Only PDF files are accepted."
      : validationError === "size"
        ? "File must be 10MB or smaller."
        : null

  return (
    <motion.div
      layout
      className="mx-auto w-full max-w-2xl"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <AnimatePresence mode="wait">
        {!isBusy ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") inputRef.current?.click()
              }}
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              animate={{
                scale: dragOver ? 1.02 : 1,
                borderColor: dragOver
                  ? "rgba(99, 102, 241, 0.8)"
                  : "rgba(255, 255, 255, 0.15)",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className={cn(
                "glass-card flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-8 py-16 text-center outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-indigo-500/50",
                dragOver && "shadow-lg shadow-indigo-500/20"
              )}
            >
              <motion.div
                animate={{ y: dragOver ? -4 : 0 }}
                className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20"
              >
                <Upload className="size-8 text-indigo-400" />
              </motion.div>

              <p className="mt-6 text-lg font-medium text-white">
                Drop your LinkedIn PDF here
              </p>
              <p className="mt-2 text-sm text-zinc-400">
                or click to browse — max 10MB
              </p>

              <input
                ref={inputRef}
                type="file"
                accept="application/pdf,.pdf"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
              />
            </motion.div>

            <AnimatePresence>
              {file && !validationError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 overflow-hidden"
                >
                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                    <FileText className="size-5 shrink-0 text-indigo-400" />
                    <div className="min-w-0 flex-1 text-left">
                      <p className="truncate text-sm font-medium text-white">
                        {file.name}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setFile(null)
                        onReset?.()
                      }}
                      className="text-xs text-zinc-400 hover:text-white"
                    >
                      Remove
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {(validationMessage || error) && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 flex items-center justify-center gap-2 text-sm text-red-400"
              >
                <AlertCircle className="size-4 shrink-0" />
                {validationMessage ?? error}
              </motion.p>
            )}

            <motion.button
              type="button"
              disabled={!file || !!validationError}
              whileHover={{ scale: file ? 1.02 : 1 }}
              whileTap={{ scale: file ? 0.98 : 1 }}
              onClick={() => file && onAnalyze(file)}
              className={cn(
                "mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-xl text-base font-medium transition-all",
                file && !validationError
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:opacity-90"
                  : "cursor-not-allowed bg-white/10 text-zinc-500"
              )}
            >
              Analyze My Profile →
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass-card rounded-2xl p-10 text-center"
          >
            <Loader2 className="mx-auto size-10 animate-spin text-indigo-400" />
            <p className="mt-6 text-lg font-medium text-white">
              {status === "uploading" ? "Uploading your PDF..." : statusMessage}
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              This usually takes under 30 seconds
            </p>
            <div className="mt-8">
              <Progress value={Math.round(progress)} className="w-full" />
              <p className="mt-2 text-xs text-zinc-500 tabular-nums">
                {Math.round(progress)}%
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
