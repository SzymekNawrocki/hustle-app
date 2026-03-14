"use client";

import Link from "next/link";
import { 
  BarChart3, 
  Sparkles
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-base-100 text-base-content selection:bg-primary selection:text-primary-content flex flex-col justify-center">
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden flex-1 flex flex-col justify-center py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full">
            <div className="text-center max-w-4xl mx-auto space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-base-200 border border-base-300 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-semibold opacity-70">Wspierane przez Groq AI</span>
              </div>
              
              <p className="text-xl lg:text-2xl text-base-content/60  max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                Zintegrowana platforma do zarządzania karierą, finansami i zdrowiem. Podnieś swoje życie na wyższy poziom z HustleOS.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
                <Link href="/login" className="btn btn-primary btn-lg px-12 gap-3 text-lg font-bold">
                  Zaloguj się
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}