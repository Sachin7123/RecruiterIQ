import { Skeleton } from "@/components/ui/skeleton"

export default function AnalyzeLoading() {
  return (
    <main className="min-h-[calc(100vh-4rem)] px-6 pb-24 pt-28">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-3 text-center">
          <Skeleton className="mx-auto h-10 w-64 bg-white/10" />
          <Skeleton className="mx-auto h-5 w-96 max-w-full bg-white/10" />
        </div>
        <Skeleton className="h-64 w-full rounded-2xl bg-white/10" />
      </div>
    </main>
  )
}
