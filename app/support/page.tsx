"use client";

import { useState } from "react";
import { Heart, Loader2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDonations, type Donation } from "@/hooks/use-donations";
import { getApiError } from "@/lib/api";

const TIERS = [
  { label: "$3", cents: 300, description: "Buy me a coffee" },
  { label: "$5", cents: 500, description: "Keep the server running" },
  { label: "$10", cents: 1000, description: "Sponsor a feature" },
];

function DonationWall({ donations }: { donations: Donation[] }) {
  if (donations.length === 0) return null;
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-display text-white/40 uppercase tracking-widest">
        Recent supporters
      </h2>
      <div className="space-y-2">
        {donations.map((d) => (
          <div
            key={d.id}
            className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white/5 border border-white/10"
          >
            <span className="text-sm text-white/80 font-display">
              {d.supporter_name || "Anonymous"}
            </span>
            <span className="text-xs text-primary font-display">
              ${(d.amount_cents / 100).toFixed(0)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SupportPage() {
  const { recentDonations, createCheckout } = useDonations();
  const [selectedCents, setSelectedCents] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const effectiveCents = isCustom
    ? Math.round(parseFloat(customAmount || "0") * 100)
    : selectedCents;

  const handleSupport = () => {
    setError("");
    if (isCustom) {
      const val = parseFloat(customAmount);
      if (!val || val < 1 || val > 100) {
        setError("Enter an amount between $1 and $100.");
        return;
      }
    }
    createCheckout.mutate(
      { amount_cents: effectiveCents, supporter_name: name.trim() || undefined },
      { onError: (e) => setError(getApiError(e)) }
    );
  };

  return (
    <main className="min-h-screen bg-black px-4 py-16">
      <div className="mx-auto max-w-lg space-y-10">

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 ring-1 ring-primary/30 flex items-center justify-center shadow-[0_0_30px_rgba(123,46,255,0.25)]">
              <Heart className="w-7 h-7 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-display font-bold text-white">
            Support Hustle App
          </h1>
          <p className="text-white/50 text-sm leading-relaxed max-w-sm mx-auto">
            Hustle App is free and open-source. If it helps you ship your goals,
            consider buying me a coffee.
          </p>
        </div>

        {/* Tier selector */}
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {TIERS.map((tier) => {
              const active = !isCustom && selectedCents === tier.cents;
              return (
                <button
                  key={tier.cents}
                  onClick={() => { setIsCustom(false); setSelectedCents(tier.cents); }}
                  className={`flex flex-col items-center gap-1 py-4 px-2 rounded-2xl border transition-all duration-200 font-display ${
                    active
                      ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(123,46,255,0.25)] text-white"
                      : "border-white/10 text-white/50 hover:border-white/20 hover:text-white/80"
                  }`}
                >
                  <span className="text-xl font-bold">{tier.label}</span>
                  <span className="text-xs text-white/40">{tier.description}</span>
                </button>
              );
            })}
          </div>

          {/* Custom amount */}
          <button
            onClick={() => setIsCustom(true)}
            className={`w-full py-3 rounded-2xl border text-sm font-display transition-all duration-200 ${
              isCustom
                ? "border-primary bg-primary/10 text-white"
                : "border-white/10 text-white/40 hover:border-white/20 hover:text-white/60"
            }`}
          >
            Custom amount
          </button>

          {isCustom && (
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-display">$</span>
              <Input
                type="number"
                min={1}
                max={100}
                step={1}
                placeholder="Enter amount (1–100)"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="pl-8 bg-white/5 border-white/10 text-white placeholder:text-white/30 font-display"
              />
            </div>
          )}
        </div>

        {/* Name field */}
        <div className="space-y-2">
          <label className="text-xs font-display text-white/40 uppercase tracking-widest">
            Your name (optional)
          </label>
          <Input
            maxLength={100}
            placeholder="Anonymous"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 font-display"
          />
          <p className="text-xs text-white/30">
            Shown on the supporters wall below.
          </p>
        </div>

        {/* Error */}
        {error && (
          <p className="text-destructive text-sm font-display text-center">{error}</p>
        )}

        {/* CTA */}
        <Button
          onClick={handleSupport}
          disabled={createCheckout.isPending}
          className="w-full font-display text-base py-6 shadow-[0_0_30px_rgba(123,46,255,0.3)]"
        >
          {createCheckout.isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Zap className="w-5 h-5 mr-2" />
              Support — ${(effectiveCents / 100).toFixed(0)}
            </>
          )}
        </Button>

        <p className="text-center text-xs text-white/20">
          Secure payment via Stripe. No account required.
        </p>

        {/* Supporters wall */}
        {recentDonations.data && recentDonations.data.length > 0 && (
          <DonationWall donations={recentDonations.data} />
        )}
      </div>
    </main>
  );
}
