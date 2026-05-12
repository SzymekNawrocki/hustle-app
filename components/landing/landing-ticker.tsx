import { TICKER } from "@/lib/landing-data";

export function LandingTicker() {
  return (
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
  );
}
