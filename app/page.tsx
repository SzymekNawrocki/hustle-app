"use client";

import Link from "next/link";
import { 
  Rocket, 
  Target, 
  Zap, 
  BarChart3, 
  Shield, 
  Sparkles,
  ArrowRight,
  Github
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-base-100 text-base-content selection:bg-primary selection:text-primary-content">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-base-100/80 backdrop-blur-md border-b border-base-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary rounded-lg shadow-lg shadow-primary/20">
                <Rocket className="w-6 h-6 text-primary-content" />
              </div>
              <span className="text-2xl font-bold text-primary">HustleOS</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm font-semibold opacity-60 hover:opacity-100 transition-opacity">Funkcje</Link>
              <Link href="/login" className="btn btn-ghost btn-sm font-semibold">Zaloguj się</Link>
              <Link href="/register" className="btn btn-primary btn-sm px-6 font-semibold shadow-lg">Rozpocznij</Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 blur-[120px] rounded-full animate-pulse delay-700" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-4xl mx-auto space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-base-200 border border-base-300 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-semibold opacity-70">Wspierane przez Groq AI</span>
              </div>
              <h1 className="text-5xl lg:text-8xl font-bold leading-[1.1] text-base-content animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                Zbuduj swój <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-shimmer">system sukcesu</span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-base-content/60  max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                Zintegrowana platforma do zarządzania karierą, finansami i zdrowiem. Podnieś swoje życie na wyższy poziom z HustleOS.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
                <Link href="/register" className="btn btn-primary btn-lg px-12 gap-3 text-lg font-bold shadow-2xl shadow-primary/40 hover:scale-105 transition-all">
                  Zacznij teraz <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/login" className="btn btn-outline btn-lg px-12 font-bold border-base-300 hover:bg-base-200 hover:text-base-content">
                  Zaloguj się
                </Link>
              </div>
            </div>

            {/* Mockup Preview */}
            <div className="mt-20 lg:mt-32 p-4 bg-base-200 border border-base-300 rounded-[2.5rem] shadow-2xl relative group animate-in zoom-in duration-1000 delay-500">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 blur opacity-30 group-hover:opacity-100 transition duration-1000" />
              <div className="relative bg-base-300 rounded-[2rem] overflow-hidden aspect-video shadow-inner flex items-center justify-center border border-base-300">
                 <div className="flex flex-col items-center gap-4 opacity-40">
                   <BarChart3 className="w-20 h-20 text-primary" />
                   <p className="font-bold text-sm">Dashboard Preview</p>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-base-200 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-20 space-y-4">
              <h2 className="text-xs font-bold text-primary">Co oferujemy?</h2>
              <p className="text-4xl lg:text-6xl font-bold text-base-content">Wszystko czego potrzebujesz</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
              {[
                {
                  icon: Target,
                  title: "Zarządzanie Celami",
                  desc: "Definiuj swoje ambicje i monitoruj postępy dzięki zaawansowanemu systemowi celów.",
                  color: "primary"
                },
                {
                  icon: BarChart3,
                  title: "Finanse pod kontrolą",
                  desc: "Śledź swój portfel inwestycyjny i aktywa w jednym, bezpiecznym miejscu.",
                  color: "secondary"
                },
                {
                  icon: Zap,
                  title: "AI Smart Create",
                  desc: "Wykorzystaj potęgę sztucznej inteligencji do generowania planów działania jednym kliknięciem.",
                  color: "accent"
                },
                {
                  icon: Utensils,
                  title: "Meal Logger AI",
                  desc: "Dbaj o zdrowie, logując posiłki naturalnym językiem. AI zajmie się resztą.",
                  color: "warning"
                },
                {
                   icon: Shield,
                   title: "Bezpieczeństwo",
                   desc: "Twoje dane są u nas bezpieczne i zaszyfrowane. Ty masz nad nimi pełną kontrolę.",
                   color: "info"
                },
                {
                   icon: Rocket,
                   title: "Kariera AI",
                   desc: "Analizuj oferty pracy i dopasowuj swoje CV do wymagań rynku dzięki Groq AI.",
                   color: "success"
                }
              ].map((feature, i) => (
                <div key={i} className="card bg-base-100 border border-base-300 shadow-xl hover:-translate-y-2 transition-all duration-300">
                  <div className="card-body p-8 space-y-4">
                    <div className={`p-4 bg-${feature.color}/10 rounded-2xl w-fit shadow-inner`}>
                      <feature.icon className={`w-8 h-8 text-${feature.color}`} />
                    </div>
                    <h3 className="card-title text-2xl font-bold text-base-content tracking-tight">{feature.title}</h3>
                    <p className="text-base-content/60 font-medium leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 border-t border-base-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="card bg-primary text-primary-content shadow-2xl p-12 lg:p-20 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-10">
                 <Rocket className="w-64 h-64 -rotate-12" />
               </div>
               <div className="relative space-y-8">
                 <h2 className="text-4xl lg:text-7xl font-bold leading-tight">Gotowy na <br /> nowy rozdział?</h2>
                 <p className="text-xl opacity-80 max-w-xl mx-auto font-medium">Dołącz do społeczności HustleOS i zacznij świadomie budować swoją przyszłość już dziś.</p>
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                   <Link href="/register" className="btn btn-neutral btn-lg px-12 font-bold shadow-2xl">Stwórz darmowe konto</Link>
                   <Link href="/login" className="btn btn-ghost hover:bg-primary-content/10 font-bold">Mam już konto</Link>
                 </div>
               </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-base-300 opacity-60">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-6">
          <div className="flex items-center justify-center gap-2">
            <Rocket className="w-5 h-5" />
            <span className="text-lg font-bold">HustleOS</span>
          </div>
          <p className="text-xs font-medium opacity-40">© 2024 HustleOS. All rights reserved.</p>
          <div className="flex justify-center gap-6">
            <Github className="w-6 h-6 hover:text-primary cursor-pointer transition-colors" />
          </div>
        </div>
      </footer>
    </div>
  );
}

// Mock icon missing in first import
function Utensils(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
  );
}