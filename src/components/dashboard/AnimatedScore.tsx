"use client"

import { useEffect, useState } from "react"
import { getOverallLabel } from "@/lib/dashboard-utils"
import { cn } from "@/lib/utils"

type AnimatedScoreProps = {
  score: number
}

export function AnimatedScore({ score }: AnimatedScoreProps) {
  const [display, setDisplay] = useState(0)
  const { label, gradientClass, colorClass } = getOverallLabel(score)

  useEffect(() => {
    const duration = 1500
    const start = performance.now()

    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(1, elapsed / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * score))
      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [score])

  return (
    <div className="flex flex-col items-center sm:items-start">
      <div className="flex items-baseline gap-1">
        <span
          className={cn(
            "font-display text-7xl font-bold tracking-tight sm:text-[96px] sm:leading-none",
            `bg-gradient-to-br ${gradientClass} bg-clip-text text-transparent`
          )}
        >
          {display}
        </span>
        <span className="text-2xl text-zinc-500 sm:text-3xl">/100</span>
      </div>
      <p className={cn("mt-2 text-lg font-medium", colorClass)}>{label}</p>
    </div>
  )
}
