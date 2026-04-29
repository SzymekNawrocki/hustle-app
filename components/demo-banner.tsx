"use client";

import { useState } from "react";
import { Info, X } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";

export function DemoBanner() {
  const { data: user } = useCurrentUser();
  const [isVisible, setIsVisible] = useState(true);

  if (!user?.is_demo || !isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 animate-in slide-in-from-top duration-500">
      <div className="bg-primary/10 backdrop-blur-md border-b border-primary/20 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-primary text-xs font-display uppercase tracking-wide">
            <Info className="w-4 h-4" />
            <span>You are in demo mode. Data is automatically reset on each guest login.</span>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            aria-label="Dismiss demo banner"
            className="cursor-pointer p-1 hover:bg-primary/20 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-primary" />
          </button>
        </div>
      </div>
    </div>
  );
}
