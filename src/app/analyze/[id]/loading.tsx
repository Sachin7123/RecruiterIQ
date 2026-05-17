import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton"

export default function AnalyzeResultLoading() {
  return (
    <main className="min-h-[calc(100vh-4rem)] px-6 pb-24 pt-28">
      <DashboardSkeleton />
    </main>
  )
}
