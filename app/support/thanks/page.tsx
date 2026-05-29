"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SupportThanksPage() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 ring-1 ring-primary/30 flex items-center justify-center shadow-[0_0_40px_rgba(123,46,255,0.3)]">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-display font-bold text-white">
            Thank you!
          </h1>
          <p className="text-white/60 text-sm leading-relaxed">
            Your support keeps Hustle App alive and improving.
            Every contribution means a lot.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button asChild className="font-display">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button asChild variant="outline" className="font-display border-white/10 text-white/70 hover:text-white">
            <Link href="/support">Back to Support</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
