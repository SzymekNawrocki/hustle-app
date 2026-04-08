"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Info, X } from "lucide-react";

export function DemoBanner() {
  const [isDemo, setIsDemo] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const checkDemo = async () => {
      try {
        const res = await api.get("/auth/me");
        if (res.data.is_demo) {
          setIsDemo(true);
        }
      } catch (err) {
        console.error("Failed to check demo status", err);
      }
    };
    checkDemo();
  }, []);

  if (!isDemo || !isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 animate-in slide-in-from-top duration-500">
      <div className="bg-primary/10 backdrop-blur-md border-b border-primary/20 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-primary text-xs font-display uppercase tracking-wide">
            <Info className="w-4 h-4" />
            <span>Jesteś w trybie demo. Dane są resetowane automatycznie przy każdym logowaniu gościa.</span>
          </div>
          <button 
            onClick={() => setIsVisible(false)}
            className="cursor-pointer p-1 hover:bg-primary/20 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-primary" />
          </button>
        </div>
      </div>
    </div>
  );
}
