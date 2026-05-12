import { FEATURES } from "@/lib/landing-data";

export function LandingFeatures() {
  return (
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
  );
}
