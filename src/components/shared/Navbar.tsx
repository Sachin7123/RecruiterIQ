"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-2">
          <span className="font-display text-lg font-bold tracking-tight text-white">
            RecruiterIQ
          </span>
          <span className="size-2 rounded-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.8)] transition-transform group-hover:scale-125" />
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/analyze/demo"
            className="hidden h-9 items-center justify-center rounded-lg border border-white/15 px-3 text-sm font-medium text-zinc-300 transition-colors hover:border-white/25 hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 active:scale-[0.97] sm:inline-flex"
          >
            Demo
          </Link>
          <Link
            href="/analyze"
            className="inline-flex h-9 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-4 text-sm font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 active:scale-[0.97]"
          >
            Analyze Profile
          </Link>
        </div>
      </nav>
    </header>
  )
}
