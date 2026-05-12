import type { LucideIcon } from "lucide-react";
import { Target, Activity, DollarSign, Briefcase } from "lucide-react";

export type TerminalLine = { type: "ok" | "dim" | "bold"; text: string };

export type Feature = {
  icon: LucideIcon;
  tag: string;
  title: string;
  body: string;
  footnote: string;
  accent: "primary" | "secondary";
};

export const FEATURES: Feature[] = [
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

export const TICKER: string[] = [
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
