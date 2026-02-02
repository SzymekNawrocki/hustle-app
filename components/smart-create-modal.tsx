"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Loader2, Sparkles, X } from "lucide-react";

interface SmartCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SmartCreateModal({ isOpen, onClose }: SmartCreateModalProps) {
  const [idea, setIdea] = useState("");
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (idea: string) => {
      const response = await api.post("/goals/smart-create", { idea });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      onClose();
      setIdea("");
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-lg bg-[#111114] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600 bg-[length:200%_auto] animate-shimmer" />
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-bold text-white">Smart Create</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-1 text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 ml-1">Opisz swój cel</label>
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="Np. Chciałbym nauczyć się Next.js w miesiąc i zbudować portfolio"
                className="w-full bg-[#1c1c21] border border-white/5 rounded-xl p-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all min-h-[120px] resize-none"
              />
            </div>

            <p className="text-xs text-gray-500 px-1">
              AI przeanalizuje Twój pomysł i wygeneruje konkretny cel wraz z listą kroków milowych.
            </p>

            <button
              onClick={() => mutate(idea)}
              disabled={isPending || !idea.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold py-3 rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  AI generuje cele...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generuj cel z AI
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
