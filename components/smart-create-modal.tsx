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
      console.log("SMART_CREATE: Sending idea:", idea);
      const response = await api.post("/goals/smart-create", { idea });
      return response.data;
    },
    onSuccess: (data) => {
      console.log("SMART_CREATE: Success!", data);
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      // Force an immediate refetch to be sure
      queryClient.refetchQueries({ queryKey: ["goals"] });
      onClose();
      setIdea("");
    },
    onError: (error: any) => {
      console.error("SMART_CREATE: Error occurred:", error.response?.data || error.message);
      const detail = error.response?.data?.detail;
      const errorMsg = typeof detail === 'string' ? detail : JSON.stringify(detail);
      alert(`Wystąpił błąd podczas generowania celu: ${errorMsg || error.message}`);
    }

  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-500 font-sans">
      <div 
        className="card w-full max-w-lg bg-base-200/50 backdrop-blur-xl border border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in duration-500 rounded-[2.5rem]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-2 bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-gradient" />
        
        <div className="card-body p-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/20 rounded-2xl shadow-inner border border-white/5">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-display text-base-content tracking-tight">Smart Create</h2>
                <p className="text-[10px] font-display opacity-40 mt-1 tracking-wider leading-relaxed">Opisz swój cel, a AI zaplanuje Twoją drogę do sukcesu.</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="btn btn-ghost btn-md btn-square rounded-2xl opacity-40 hover:opacity-100 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-8 text-left">
            <div className="form-control">
              <label className="label">
                <span className="label-text-alt font-display opacity-40 tracking-wider">Twój Cel</span>
              </label>
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="Np. Chciałbym nauczyć się Next.js w miesiąc i zbudować portfolio"
                className="textarea textarea-bordered h-44 bg-base-100/50 border-white/5 focus:textarea-primary transition-all resize-none text-base p-6 rounded-2xl leading-relaxed"
              />
            </div>

            <p className="text-[9px] font-display opacity-30 text-center tracking-wide px-8 leading-relaxed">
              AI przeanalizuje Twój pomysł i wygeneruje konkretny cel wraz z listą kroków milowych.
            </p>

            <button
              onClick={() => mutate(idea)}
              disabled={isPending || !idea.trim()}
              className="btn btn-primary btn-block btn-lg gap-4 font-display text-lg tracking-wide shadow-[0_0_20px_rgba(123,46,255,0.2)] transition-all hover:scale-[1.01] h-14"
            >
              {isPending ? (
                <>
                  <span className="loading loading-spinner"></span>
                  AI generuje...
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
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
