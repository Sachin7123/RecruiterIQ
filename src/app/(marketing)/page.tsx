import { DemoPreview } from "@/components/landing/DemoPreview"
import { FeaturesSection } from "@/components/landing/FeaturesSection"
import { FinalCTASection } from "@/components/landing/FinalCTASection"
import { HeroSection } from "@/components/landing/HeroSection"
import { HowItWorksSection } from "@/components/landing/HowItWorksSection"
import { ScorePreviewSection } from "@/components/landing/ScorePreviewSection"

export default function MarketingPage() {
  return (
    <>
      <HeroSection />
      <DemoPreview />
      <FeaturesSection />
      <HowItWorksSection />
      <ScorePreviewSection />
      <FinalCTASection />
    </>
  )
}
