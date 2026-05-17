import type { Metadata } from "next"
import { Inter, Syne } from "next/font/google"
import { Toaster } from "sonner"
import { Navbar } from "@/components/shared/Navbar"
import { SiteFooter } from "@/components/shared/SiteFooter"
import { SITE_AUTHOR, SITE_PRODUCT } from "@/lib/site-config"
import { TooltipProvider } from "@/components/ui/tooltip"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL?.trim() || SITE_PRODUCT.defaultUrl
  ),
  title: "RecruiterIQ — LinkedIn Profile Analyzer",
  description:
    "Upload your LinkedIn PDF and get a brutally honest recruiter scorecard. See exactly why recruiters skip your profile.",
  openGraph: {
    title: "RecruiterIQ — LinkedIn Profile Analyzer",
    description:
      "Upload your LinkedIn PDF and get a brutally honest recruiter scorecard. See exactly why recruiters skip your profile.",
    url: SITE_PRODUCT.defaultUrl,
    siteName: "RecruiterIQ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RecruiterIQ — LinkedIn Profile Analyzer",
    description:
      "Upload your LinkedIn PDF and get a brutally honest recruiter scorecard.",
  },
  authors: [{ name: SITE_AUTHOR.name, url: SITE_AUTHOR.linkedin }],
  creator: SITE_AUTHOR.name,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${syne.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <TooltipProvider>
          <div className="grid-bg min-h-screen">
            <Navbar />
            <main className="flex min-h-[calc(100vh-4rem)] flex-col">
              <div className="flex-1">{children}</div>
              <SiteFooter />
            </main>
          </div>
          <Toaster
            theme="dark"
            position="bottom-center"
            toastOptions={{
              classNames: {
                toast: "glass-card border border-white/10 text-white",
              },
            }}
          />
        </TooltipProvider>
      </body>
    </html>
  )
}
