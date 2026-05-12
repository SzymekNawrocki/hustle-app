import type { TerminalLine } from "@/lib/landing-data";

interface TerminalBlockProps {
  prompt: string;
  lines: TerminalLine[];
  accent: "primary" | "secondary";
}

export function TerminalBlock({ prompt, lines, accent }: TerminalBlockProps) {
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
