import Link from "next/link"
import { ExternalLink, GitBranch, UserRound } from "lucide-react"
import { SITE_AUTHOR, SITE_PRODUCT } from "@/lib/site-config"

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black/40 px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-display text-lg font-semibold text-white">
            {SITE_PRODUCT.name}
          </p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-500">
            {SITE_PRODUCT.description}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Created by
          </p>
          <p className="mt-2 font-medium text-white">{SITE_AUTHOR.name}</p>
          <p className="text-sm text-zinc-400">{SITE_AUTHOR.title}</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-zinc-500">
            {SITE_AUTHOR.tagline}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={SITE_AUTHOR.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-indigo-300"
            >
              <UserRound className="size-4" />
              LinkedIn
              <ExternalLink className="size-3 opacity-60" />
            </Link>
            <Link
              href={SITE_AUTHOR.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-indigo-300"
            >
              <GitBranch className="size-4" />
              GitHub
              <ExternalLink className="size-3 opacity-60" />
            </Link>
            <Link
              href={SITE_AUTHOR.repository}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-indigo-300"
            >
              Source code
              <ExternalLink className="size-3 opacity-60" />
            </Link>
          </div>
        </div>
      </div>

      <p className="mx-auto mt-10 max-w-6xl text-center text-xs text-zinc-600">
        © {new Date().getFullYear()} {SITE_AUTHOR.name}. AI-generated feedback is for
        guidance only — not hiring or legal advice.
      </p>
    </footer>
  )
}
