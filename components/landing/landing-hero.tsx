import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, ChevronRight, Sparkles } from "lucide-react";

export function LandingHero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 lp-grid">
      <div className="absolute inset-0 lp-scan" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4  w-[650px] h-[650px] rounded-full bg-primary/7  blur-[140px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-1/3 right-1/4 w-[550px] h-[550px] rounded-full bg-secondary/7 blur-[120px]  translate-x-1/2  translate-y-1/2" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <div className="fade-up du-1 mb-8 mt-12 flex justify-center">
          <Badge className="inline-flex items-center gap-2 bg-primary/10 text-primary border-primary/30 px-4 py-1.5">
            <Brain className="w-3.5 h-3.5" />
            <span className="font-mono text-xs tracking-widest">POWERED BY GROQ AI · LLAMA 3.3 70B</span>
          </Badge>
        </div>

        <h1 className="fade-up du-2 font-display leading-[0.88] tracking-tight mb-8" style={{ fontSize: "clamp(3.8rem, 13vw, 10rem)" }}>
          <span className="block">YOUR</span>
          <span className="block text-primary glow-p">HUSTLE.</span>
          <span className="block">
            ORGANIZED
            <span className="text-secondary glow-s">.</span>
          </span>
        </h1>

        <p className="fade-up du-3 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
          Goals, finances, health, and career — one command center.
          AI that understands you, not just your keywords.{" "}
          <span className="text-foreground font-medium">Stop juggling apps. Start winning.</span>
        </p>

        <div className="fade-up du-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="font-display tracking-widest text-base px-10">
            <Link href="/register">
              GET STARTED FREE <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="font-display tracking-widest text-base px-10 border-primary/35 text-primary hover:bg-primary/10"
          >
            <Link href="/login">
              <Sparkles className="w-4 h-4 mr-2" /> TRY DEMO
            </Link>
          </Button>
        </div>

        <p className="fade-up du-5 mt-6 text-xs font-mono text-muted-foreground/50 tracking-widest py-7">
          NO CREDIT CARD · FREE DEMO · ZERO FRICTION
        </p>
      </div>
    </section>
  );
}
