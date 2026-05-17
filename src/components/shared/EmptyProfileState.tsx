import Link from "next/link"
import { FileQuestion } from "lucide-react"

export function EmptyProfileState() {
  return (
    <div className="glass-card mx-auto max-w-lg rounded-2xl p-10 text-center">
      <FileQuestion className="mx-auto size-12 text-zinc-500" />
      <h2 className="mt-4 font-display text-2xl font-bold text-white">
        We couldn&apos;t read your profile
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-zinc-400">
        The PDF didn&apos;t yield enough structured data. Try exporting directly from
        LinkedIn (Save to PDF) rather than a scanned resume.
      </p>
      <Link
        href="/analyze"
        className="mt-8 inline-flex h-11 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-6 text-sm font-medium text-white transition-transform hover:opacity-90 active:scale-[0.97]"
      >
        Upload another PDF
      </Link>
    </div>
  )
}
