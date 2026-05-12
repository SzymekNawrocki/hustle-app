"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap, ArrowRight, Menu, X } from "lucide-react";

export function LandingNav() {
  const [navOpen, setNavOpen] = useState(false);

  return (
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

        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#ai"       className="hover:text-foreground transition-colors">AI Engine</a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button size="sm" asChild className="font-display tracking-widest">
            <Link href="/login">TRY DEMO <ArrowRight className="w-3.5 h-3.5 ml-1.5" /></Link>
          </Button>
        </div>

        <button
          className="md:hidden text-muted-foreground hover:text-foreground"
          onClick={() => setNavOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {navOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {navOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 px-6 py-6 space-y-4">
          {["#features", "#ai"].map(href => (
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
  );
}
