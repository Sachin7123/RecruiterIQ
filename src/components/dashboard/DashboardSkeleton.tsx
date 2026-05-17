"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 overflow-x-hidden">
      <Skeleton className="h-48 w-full rounded-3xl bg-white/10" />
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-36 rounded-2xl bg-white/10" />
            ))}
          </div>
          <Skeleton className="h-64 rounded-2xl bg-white/10" />
          <Skeleton className="h-48 rounded-2xl bg-white/10" />
        </div>
        <div className="space-y-6 lg:col-span-2">
          <Skeleton className="h-56 rounded-2xl bg-white/10" />
          <Skeleton className="h-40 rounded-2xl bg-white/10" />
          <Skeleton className="h-32 rounded-2xl bg-white/10" />
        </div>
      </div>
    </div>
  )
}
