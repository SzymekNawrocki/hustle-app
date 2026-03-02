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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="card w-full max-w-lg bg-base-200 border border-base-300 shadow-2xl overflow-hidden animate-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1.5 bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-shimmer" />
        
        <div className="card-body p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <h2 className="card-title text-2xl font-bold text-base-content">Smart Create</h2>
            </div>
            <button 
              onClick={onClose}
              className="btn btn-ghost btn-sm btn-square"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6 text-left">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold opacity-40 text-xs">Opisz swój cel</span>
              </label>
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="Np. Chciałbym nauczyć się Next.js w miesiąc i zbudować portfolio"
                className="textarea textarea-bordered h-36 bg-base-100 focus:textarea-primary transition-all resize-none text-base"
              />
            </div>

            <p className="text-xs opacity-60 text-center">
              AI przeanalizuje Twój pomysł i wygeneruje konkretny cel wraz z listą kroków milowych.
            </p>

            <button
              onClick={() => mutate(idea)}
              disabled={isPending || !idea.trim()}
              className="btn btn-primary btn-block shadow-lg gap-2 text-lg h-14"
            >
              {isPending ? (
                <>
                  <span className="loading loading-spinner"></span>
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
