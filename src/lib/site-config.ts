/** Public site & author metadata — safe to import from client and server. */
export const SITE_AUTHOR = {
  name: "Sachin Parmar",
  title: "Software Engineer",
  tagline: "Built RecruiterIQ to show how hiring teams actually read profiles.",
  github: "https://github.com/Sachin7123",
  linkedin: "https://www.linkedin.com/in/sachinparmar7123",
  repository: "https://github.com/Sachin7123/Recruiter-IQ-LinkedIn",
} as const

export const SITE_PRODUCT = {
  name: "RecruiterIQ",
  description:
    "AI-powered LinkedIn profile analyzer — recruiter-style scoring, commentary, and rewrites.",
  defaultUrl: "https://recruiter-iq-wine.vercel.app",
} as const

export function getSiteUrl(): string {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_APP_URL?.trim()) {
    return process.env.NEXT_PUBLIC_APP_URL.trim().replace(/\/$/, "")
  }
  return SITE_PRODUCT.defaultUrl
}
