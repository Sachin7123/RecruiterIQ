import Link from "next/link"
import { cn } from "@/lib/utils"

type GhostButtonProps = {
  href: string
  children: React.ReactNode
  className?: string
}

export function GhostButton({ href, children, className }: GhostButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-14 items-center justify-center rounded-xl border border-white/15 px-8 text-base font-medium text-zinc-300 transition-colors hover:border-white/25 hover:bg-white/5 hover:text-white",
        className
      )}
    >
      {children}
    </Link>
  )
}
