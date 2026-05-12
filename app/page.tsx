"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  TrendingUp,
  Heart,
  Briefcase,
  Zap,
  Brain,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Activity,
  DollarSign,
  Menu,
  X,
} from "lucide-react";

// ─── Counter animation hook ──────────────────────────────────────────────────

function useCounter(target: number, duration = 1800) {
  const [count, setCount] = useState(0);
  const startedRef = useRef(false);
  const elRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          const steps = 60;
          const inc = target / steps;
          let cur = 0;
          const id = setInterval(() => {
            cur += inc;
            if (cur >= target) {
              setCount(target);
              clearInterval(id);
            } else {
              setCount(Math.floor(cur));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, elRef };
}

// ─── Data ────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Target,
    tag: "GOAL COMMAND",
    title: "Stop dreaming. Start tracking.",
    body: "Break big ambitions into daily wins. Milestones, tasks, streaks — all mapped to your end game. Because 'someday' is not a date on any calendar.",
    footnote: "94% of tracked goals get completed. The other 6% didn't use this app.",
    accent: "primary",
  },
  {
    icon: DollarSign,
    tag: "FINANCE OPS",
    title: "Know where your money went.",
    body: "Log expenses, track income, understand your financial position. AI-powered input means you describe it, we categorize it. No spreadsheets. No excuses.",
    footnote: "avg. user saves 3h/week on bookkeeping. That's 156h/year. You're welcome.",
    accent: "secondary",
  },
  {
    icon: Activity,
    tag: "HEALTH INTEL",
    title: "Your body is your hardware.",
    body: "Log meals by just typing what you ate — 'had a burger and two beers' becomes a full nutrition breakdown. AI does the heavy lifting, you just live your life.",
    footnote: "10× faster than manual logging. Also infinitely less annoying.",
    accent: "primary",
  },
  {
    icon: Briefcase,
    tag: "CAREER TRACKER",
    title: "Hunt smarter, not harder.",
    body: "Track every application, interview stage, and opportunity in one place. Never lose track of where you stand, who you talked to, and what comes next.",
    footnote: "Your dream job is one organized pipeline away.",
    accent: "secondary",
  },
];

const TICKER = [
  "YOUR PLAN IS ONLY AS GOOD AS YOUR TRACKING",
  "GROQ AI: FASTER THAN YOUR EXCUSES",
  "0 SPREADSHEETS HARMED IN THE MAKING OF THIS APP",
  "84% OF GOALS FAIL BECAUSE NOBODY MEASURED THEM",
  "THE HUSTLE IS REAL. SO IS THE DATA.",
  "AI MEAL PARSING: JUST TYPE WHAT YOU ATE",
  "FINANCIAL CLARITY IS NOT A LUXURY — IT'S A WEAPON",
  "TRACK TODAY. WIN TOMORROW.",
  "POWERED BY LLAMA 3.3 70B. FUELED BY AMBITION.",
  "LESS CHAOS. MORE PROGRESS.",
];

const PREVIEWS = [
  { file: "goals-preview.png", tag: "GOAL COMMAND CENTER", accent: "primary", icon: Target },
  { file: "finance-preview.png", tag: "FINANCE OPERATIONS", accent: "secondary", icon: TrendingUp },
  { file: "health-preview.png", tag: "HEALTH INTELLIGENCE", accent: "primary", icon: Heart },
  { file: "career-preview.png", tag: "CAREER TRACKER", accent: "secondary", icon: Briefcase },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function LandingPage() {
  const { count: c1, elRef: r1 } = useCounter(2400);
  const { count: c2, elRef: r2 } = useCounter(18700);
  const { count: c3, elRef: r3 } = useCounter(99);
  const [navOpen, setNavOpen] = useState(false);

  return (
    <>
      <style>{`
        @keyframes ticker-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes grid-drift {
          0%   { background-position: 0 0; }
          100% { background-position: 60px 60px; }
        }

        .lp-grid {
          background-image:
            linear-gradient(oklch(0.72 0.23 305 / 5%) 1px, transparent 1px),
            linear-gradient(90deg, oklch(0.72 0.23 305 / 5%) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .lp-scan {
          background-image: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 3px,
            oklch(0 0 0 / 4%) 3px,
            oklch(0 0 0 / 4%) 4px
          );
          pointer-events: none;
        }

        .fade-up      { animation: fade-up 0.75s ease both; }
        .du-1         { animation-delay: 0.05s; }
        .du-2         { animation-delay: 0.20s; }
        .du-3         { animation-delay: 0.38s; }
        .du-4         { animation-delay: 0.55s; }
        .du-5         { animation-delay: 0.72s; }

        .glow-p { text-shadow: 0 0 28px oklch(0.72 0.23 305 / 55%), 0 0 60px oklch(0.72 0.23 305 / 25%); }
        .glow-s { text-shadow: 0 0 28px oklch(0.83 0.18 195 / 55%), 0 0 60px oklch(0.83 0.18 195 / 25%); }
        .glow-icon-p { filter: drop-shadow(0 0 10px oklch(0.72 0.23 305 / 75%)); }
        .glow-icon-s { filter: drop-shadow(0 0 10px oklch(0.83 0.18 195 / 75%)); }

        .ticker-track {
          display: flex;
          width: max-content;
          animation: ticker-scroll 50s linear infinite;
        }
        .ticker-track:hover { animation-play-state: paused; }

        .feat-card {
          transition: transform 0.3s ease;
          position: relative;
        }
        .feat-card:hover { transform: translateY(-5px); }
        .feat-card::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          opacity: 0;
          transition: opacity 0.3s;
          background: radial-gradient(ellipse at 50% 0%, oklch(0.72 0.23 305 / 8%) 0%, transparent 70%);
        }
        .feat-card.s::after {
          background: radial-gradient(ellipse at 50% 0%, oklch(0.83 0.18 195 / 8%) 0%, transparent 70%);
        }
        .feat-card:hover::after { opacity: 1; }

        .cursor-blink { animation: cursor-blink 1s step-end infinite; }

        .terminal-line { opacity: 0; transform: translateY(8px); }
        .terminal-line.visible {
          opacity: 1; transform: translateY(0);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
      `}</style>

      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

        {/* ── NAV ─────────────────────────────────────────────────────────── */}
        <nav className="fixed top-0 inset-x-0 z-50 border-b border-border/40 bg-background/75 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/35 flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary glow-icon-p" />
              </div>
              <span className="font-display text-xl tracking-wide">
                HUSTLE<span className="text-primary">.</span>
              </span>
            </div>

            {/* desktop links */}
            <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
              <a href="#features" className="hover:text-foreground transition-colors">Features</a>
              <a href="#ai"       className="hover:text-foreground transition-colors">AI Engine</a>
              <a href="#preview"  className="hover:text-foreground transition-colors">Preview</a>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
              <Button size="sm" asChild className="font-display tracking-widest">
                <Link href="/login">TRY DEMO <ArrowRight className="w-3.5 h-3.5 ml-1.5" /></Link>
              </Button>
            </div>

            {/* mobile hamburger */}
            <button
              className="md:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setNavOpen(o => !o)}
              aria-label="Toggle menu"
            >
              {navOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* mobile drawer */}
          {navOpen && (
            <div className="md:hidden border-t border-border/40 bg-background/95 px-6 py-6 space-y-4">
              {["#features", "#ai", "#preview"].map(href => (
                <a
                  key={href}
                  href={href}
                  className="block text-muted-foreground hover:text-foreground transition-colors capitalize"
                  onClick={() => setNavOpen(false)}
                >
                  {href.slice(1)}
                </a>
              ))}
              <div className="flex flex-col gap-3 pt-2">
                <Button variant="outline" size="sm" asChild><Link href="/login">Sign in</Link></Button>
                <Button size="sm" asChild><Link href="/login">Try Demo</Link></Button>
              </div>
            </div>
          )}
        </nav>

        {/* ── HERO ────────────────────────────────────────────────────────── */}
        <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 lp-grid">
          <div className="absolute inset-0 lp-scan" />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/3 left-1/4  w-[650px] h-[650px] rounded-full bg-primary/7  blur-[140px] -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-1/3 right-1/4 w-[550px] h-[550px] rounded-full bg-secondary/7 blur-[120px]  translate-x-1/2  translate-y-1/2" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
            <div className="fade-up du-1 mb-8 flex justify-center">
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

            <p className="fade-up du-5 mt-6 text-xs font-mono text-muted-foreground/50 tracking-widest">
              NO CREDIT CARD · FREE DEMO · ZERO FRICTION
            </p>
          </div>

          {/* Dashboard preview placeholder */}
          <div
            className="fade-up relative z-10 mt-20 w-full max-w-5xl mx-auto px-4"
            style={{ animationDelay: "0.85s", animationFillMode: "both" }}
          >
            <div className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden aspect-[16/9]">
              {/* macOS-style titlebar */}
              <div className="h-9 bg-card/90 border-b border-border/40 flex items-center px-4 gap-2 flex-shrink-0">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                <span className="ml-4 text-xs font-mono text-muted-foreground/60">hustle-app — dashboard</span>
              </div>
              <div className="flex-1 lp-grid flex flex-col items-center justify-center gap-3 text-muted-foreground">
                <Target className="w-10 h-10 opacity-15 text-primary" />
                <p className="font-mono text-sm opacity-50">dashboard-preview.png</p>
                <p className="font-mono text-xs opacity-30">→ /public/dashboard-preview.png</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── TICKER ──────────────────────────────────────────────────────── */}
        <div className="border-y border-primary/20 bg-primary/5 overflow-hidden py-4 relative">
          <div className="absolute left-0 inset-y-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 inset-y-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          <div className="ticker-track">
            {[...TICKER, ...TICKER].map((item, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-6 px-8 font-mono text-xs text-primary/65 tracking-widest whitespace-nowrap"
              >
                <span>{item}</span>
                <span className="text-primary/40">◆</span>
              </span>
            ))}
          </div>
        </div>

        {/* ── STATS ───────────────────────────────────────────────────────── */}
        <section className="py-20 border-b border-border/20">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/20">
              {[
                { ref: r1, count: c1, suffix: "+", label: "HUSTLERS ACTIVE", accent: "p" },
                { ref: r2, count: c2, suffix: "+", label: "GOALS TRACKED",   accent: "s" },
                { ref: r3, count: c3, suffix: "%", label: "AI ACCURACY RATE", accent: "p" },
              ].map(({ ref, count, suffix, label, accent }) => (
                <div key={label} className="p-10 text-center">
                  <div className={`font-display text-6xl mb-2 ${accent === "p" ? "text-primary glow-p" : "text-secondary glow-s"}`}>
                    <span ref={ref}>{count.toLocaleString()}</span>{suffix}
                  </div>
                  <p className="text-muted-foreground font-mono text-xs tracking-widest">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ────────────────────────────────────────────────────── */}
        <section id="features" className="py-24">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <p className="font-mono text-xs text-primary tracking-widest mb-5">// FEATURE SET</p>
              <h2 className="font-display text-5xl md:text-7xl leading-[0.9]">
                One app.<br />
                <span className="text-secondary glow-s">Zero</span> excuses.
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {FEATURES.map(({ icon: Icon, tag, title, body, footnote, accent }) => {
                const isPri = accent === "primary";
                return (
                  <div
                    key={tag}
                    className={`feat-card ${isPri ? "" : "s"} rounded-2xl bg-card/55 border border-border/30 p-8 backdrop-blur-sm`}
                  >
                    <div className="flex items-start gap-6">
                      <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center border ${isPri ? "bg-primary/10 border-primary/20" : "bg-secondary/10 border-secondary/20"}`}>
                        <Icon className={`w-6 h-6 ${isPri ? "text-primary glow-icon-p" : "text-secondary glow-icon-s"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-mono text-xs tracking-widest mb-2 ${isPri ? "text-primary" : "text-secondary"}`}>
                          {tag}
                        </p>
                        <h3 className="font-display text-2xl mb-3">{title}</h3>
                        <p className="text-muted-foreground leading-relaxed text-sm">{body}</p>
                        <div className={`mt-6 pt-4 border-t ${isPri ? "border-primary/15" : "border-secondary/15"}`}>
                          <p className={`text-xs font-mono ${isPri ? "text-primary/65" : "text-secondary/65"}`}>
                            ↗ {footnote}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── AI ENGINE ───────────────────────────────────────────────────── */}
        <section id="ai" className="py-24 border-y border-border/20 relative overflow-hidden">
          <div className="absolute inset-0 lp-grid opacity-50" />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full bg-secondary/6 blur-[160px] translate-x-1/3 -translate-y-1/3" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="font-mono text-xs text-secondary tracking-widest mb-6">// AI ENGINE</p>
                <h2 className="font-display text-5xl md:text-6xl leading-[0.9] mb-8">
                  AI that works<br />
                  <span className="text-secondary glow-s">as hard as you.</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-8 text-lg">
                  Powered by Groq's llama-3.3-70b-versatile — one of the fastest large language models on the planet.{" "}
                  <strong className="text-foreground">It doesn't just analyze. It understands.</strong>
                </p>
                <div className="space-y-5">
                  {[
                    {
                      icon: Heart,
                      text: "Log meals in plain English. 'Ate two slices of pizza and a salad' → full macro breakdown. No app. No menu navigation. Just type.",
                    },
                    {
                      icon: DollarSign,
                      text: "Describe your hustle income naturally. AI categorizes, tracks, and surfaces trends automatically.",
                    },
                    {
                      icon: Target,
                      text: "Daily dashboard aggregates your goals, spending, and health in one glance — so you know exactly where you stand.",
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <item.icon className="w-4 h-4 text-secondary" />
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Terminal mockup */}
              <div className="rounded-2xl border border-secondary/30 bg-card/80 overflow-hidden">
                <div className="bg-card/90 border-b border-border/40 px-4 py-3 flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-secondary/70 glow-icon-s" />
                  <span className="font-mono text-xs text-muted-foreground ml-1">hustle-ai — active session</span>
                </div>
                <div className="p-6 font-mono text-sm space-y-5">
                  <TerminalBlock
                    prompt={`log meal "had a burger, fries and a coke for lunch"`}
                    lines={[
                      { type: "ok",   text: "Parsing meal description..." },
                      { type: "dim",  text: "→ Burger (beef patty, bun):  520 kcal" },
                      { type: "dim",  text: "→ Fries (medium):            365 kcal" },
                      { type: "dim",  text: "→ Coca-Cola (can):           140 kcal" },
                      { type: "bold", text: "→ Total: 1025 kcal | P: 38g | C: 142g | F: 44g" },
                      { type: "ok",   text: "Logged to today's health dashboard." },
                    ]}
                    accent="secondary"
                  />
                  <TerminalBlock
                    prompt={`add income "freelance design work, paid $850"`}
                    lines={[
                      { type: "ok",   text: "Categorized: Freelance / Design" },
                      { type: "bold", text: "→ $850.00 added to income log" },
                      { type: "ok",   text: "Finance dashboard updated." },
                    ]}
                    accent="primary"
                  />
                  <div className="flex items-center gap-2 text-muted-foreground/40 text-xs">
                    <span className="text-secondary/60">user@hustle:~$</span>
                    <span className="w-2 h-[1.1em] bg-secondary/60 cursor-blink inline-block align-middle" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SCREENSHOTS ─────────────────────────────────────────────────── */}
        <section id="preview" className="py-24">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <p className="font-mono text-xs text-primary tracking-widest mb-5">// THE INTERFACE</p>
              <h2 className="font-display text-5xl md:text-7xl leading-[0.9]">
                Built for the<br />
                <span className="text-primary glow-p">relentless.</span>
              </h2>
              <p className="text-muted-foreground mt-6 max-w-xl mx-auto">
                Dark by default. Fast by design. Clean enough to think, detailed enough to decide.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {PREVIEWS.map(({ file, tag, accent, icon: Icon }) => {
                const isPri = accent === "primary";
                return (
                  <div
                    key={file}
                    className="relative rounded-2xl border border-border/30 bg-card/40 overflow-hidden aspect-video group feat-card"
                  >
                    <div className="absolute inset-0 lp-grid opacity-20" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                      <Icon className={`w-12 h-12 opacity-15 ${isPri ? "text-primary" : "text-secondary"}`} />
                      <p className="font-mono text-xs tracking-widest opacity-35">{file}</p>
                      <p className="font-mono text-xs opacity-20">→ /public/{file}</p>
                    </div>
                    <div className="absolute top-0 inset-x-0 h-8 bg-card/80 border-b border-border/30 flex items-center px-3 gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500/35" />
                      <div className="w-2 h-2 rounded-full bg-yellow-500/35" />
                      <div className="w-2 h-2 rounded-full bg-green-500/35" />
                      <span className={`ml-3 font-mono text-xs ${isPri ? "text-primary/55" : "text-secondary/55"}`}>{tag}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ───────────────────────────────────────────────────── */}
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
      </div>
    </>
  );
}

// ─── Terminal line component ─────────────────────────────────────────────────

type TerminalLine = { type: "ok" | "dim" | "bold"; text: string };

function TerminalBlock({
  prompt,
  lines,
  accent,
}: {
  prompt: string;
  lines: TerminalLine[];
  accent: "primary" | "secondary";
}) {
  const isPri = accent === "primary";
  const colorClass = isPri ? "text-primary" : "text-secondary";
  const borderClass = isPri ? "border-primary/25" : "border-secondary/25";

  return (
    <div>
      <div className="text-xs text-muted-foreground/80 mb-2">
        <span className={`${colorClass} opacity-70`}>user@hustle:~$</span>{" "}
        <span className="text-foreground/90">{prompt}</span>
      </div>
      <div className={`pl-4 border-l ${borderClass} space-y-1.5`}>
        {lines.map((l, i) => (
          <p
            key={i}
            className={
              l.type === "ok"
                ? `${colorClass} text-xs`
                : l.type === "bold"
                ? "text-foreground font-semibold text-xs"
                : "text-muted-foreground text-xs"
            }
          >
            {l.text}
          </p>
        ))}
      </div>
    </div>
  );
}
