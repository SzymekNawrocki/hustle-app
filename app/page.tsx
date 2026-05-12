import { LandingNav }      from "@/components/landing/landing-nav";
import { LandingHero }     from "@/components/landing/landing-hero";
import { LandingTicker }   from "@/components/landing/landing-ticker";
import { LandingFeatures } from "@/components/landing/landing-features";
import { LandingAiEngine } from "@/components/landing/landing-ai-engine";
import { LandingCta }      from "@/components/landing/landing-cta";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <LandingNav />
      <LandingHero />
      <LandingTicker />
      <LandingFeatures />
      <LandingAiEngine />
      <LandingCta />
    </div>
  );
}
