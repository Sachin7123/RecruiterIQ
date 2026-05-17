import Link from "next/link"
import { DemoAnalysisView } from "./DemoAnalysisView"

export const metadata = {
  title: "Demo Report — RecruiterIQ",
  description: "Sample recruiter scorecard — no PDF upload required.",
}

export default function DemoAnalyzePage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] px-6 pb-24 pt-28">
      <div className="mx-auto mb-6 max-w-7xl rounded-xl border border-indigo-500/25 bg-indigo-500/10 px-4 py-3 text-center text-sm text-indigo-200">
        <span className="font-medium">Demo mode</span> — sample analysis only.{" "}
        <Link href="/analyze" className="underline hover:text-white">
          Upload your own PDF
        </Link>
      </div>
      <DemoAnalysisView />
    </main>
  )
}
