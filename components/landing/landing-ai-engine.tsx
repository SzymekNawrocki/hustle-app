import { Heart, DollarSign, Target } from "lucide-react";
import { TerminalBlock } from "./terminal-block";

const AI_BULLETS = [
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
];

export function LandingAiEngine() {
  return (
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
              Powered by Groq&apos;s llama-3.3-70b-versatile — one of the fastest large language models on the planet.{" "}
              <strong className="text-foreground">It doesn&apos;t just analyze. It understands.</strong>
            </p>
            <div className="space-y-5">
              {AI_BULLETS.map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <item.icon className="w-4 h-4 text-secondary" />
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

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
  );
}
