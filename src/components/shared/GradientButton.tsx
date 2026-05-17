import Link from "next/link"
import { cn } from "@/lib/utils"

type GradientButtonProps = {
  href: string
  children: React.ReactNode
  className?: string
  size?: "default" | "lg"
}

export function GradientButton({
  href,
  children,
  className,
  size = "default",
}: GradientButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 font-medium text-white shadow-lg shadow-indigo-500/25 transition-all hover:opacity-90 hover:shadow-indigo-500/40",
        size === "lg" ? "h-14 px-8 text-base" : "h-11 px-6 text-sm",
        className
      )}
    >
      {children}
    </Link>
  )
}
