import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function LandingCta() {
  return (
    <section className="py-36 relative overflow-hidden border-t border-border/20">
      <div className="absolute inset-0 lp-grid opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[600px] h-[600px] rounded-full bg-primary/6 blur-[130px]" />
        </div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
        <p className="font-mono text-xs text-primary tracking-widest mb-10">// GET STARTED TODAY</p>
        <h2 className="font-display leading-[0.9] mb-10" style={{ fontSize: "clamp(3.5rem, 11vw, 7rem)" }}>
          The hustle<br />starts<br />
          <span className="text-primary glow-p">now.</span>
        </h2>
        <p className="text-muted-foreground text-lg mb-12 leading-relaxed">
          Free to start. AI-powered from day one. No credit card, no paywall hiding the good stuff.
          <br />
          <span className="text-foreground font-medium">Just you, your goals, and the tools to hit them.</span>
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="font-display tracking-widest text-base px-12">
            <Link href="/register">
              START FOR FREE <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="lg"
            className="font-display tracking-widest text-base text-muted-foreground hover:text-foreground"
          >
            <Link href="/login">Already hustling? Sign in →</Link>
          </Button>
        </div>

        <p className="mt-10 text-xs font-mono text-muted-foreground/40 tracking-widest">
          NO CREDIT CARD · FREE DEMO · NO BS
        </p>
      </div>
    </section>
  );
}
