"use client";

import Link from "next/link";
import Image from "next/image";
import { 
  Sparkles
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground flex flex-col justify-center">
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden flex-1 flex flex-col justify-center py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full">
            <div className="text-center max-w-4xl mx-auto space-y-8">
              <div className="flex justify-center mb-12 relative">
                <div className="absolute inset-0 bg-primary/10 blur-[120px] rounded-full -z-10 scale-150" />
                <Image 
                  src="/hustle-app.png" 
                  alt="Hustle App Interface" 
                  width={200} 
                  height={100} 
                  className="rounded-3xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.6)] border border-border/60"
                  priority
                />
              </div>

              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/60 border border-border/60 shadow-xl">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold text-muted-foreground">Powered by Groq AI</span>
                </div>
                
                <h1 className="text-4xl lg:text-6xl font-display tracking-tight">
                  Level up your life to the <span className="text-primary">next stage</span>
                </h1>
                
                <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-sans">
                  An integrated platform to manage your career, finances, and health with Hustle App.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button asChild size="lg" className="px-12 gap-3 text-lg">
                  <Link href="/login">Sign in</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}