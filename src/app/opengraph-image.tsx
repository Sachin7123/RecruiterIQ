import { ImageResponse } from "next/og"
import { SITE_PRODUCT } from "@/lib/site-config"

export const alt = "RecruiterIQ — LinkedIn Profile Analyzer"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "linear-gradient(135deg, #0f0f23 0%, #1a1a3e 100%)",
          color: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 36, fontWeight: 700 }}>RecruiterIQ</span>
          <span style={{ fontSize: 20, color: "#a1a1aa" }}>
            {new URL(SITE_PRODUCT.defaultUrl).host}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.1, margin: 0 }}>
            See how recruiters actually evaluate your LinkedIn profile.
          </p>
          <p style={{ fontSize: 24, color: "#a1a1aa", marginTop: 24 }}>
            Brutally honest scorecard in 30 seconds.
          </p>
        </div>
        <p style={{ fontSize: 18, color: "#818cf8" }}>Upload your LinkedIn PDF</p>
      </div>
    ),
    { ...size }
  )
}
