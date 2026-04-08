"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Loader2, Sparkles, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

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
      <Card
        className="w-full max-w-lg bg-base-200/50 backdrop-blur-xl border border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in duration-500 rounded-[2.5rem]"
        onClick={(e) => e.stopPropagation()}
      >
        <CardContent className="p-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/20 rounded-2xl shadow-inner border border-white/5">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-display text-base-content tracking-tight">Smart Create</h2>
                <p className="text-xs font-display opacity-50 mt-1 tracking-wide leading-relaxed">Opisz swój cel, a AI zaplanuje Twoją drogę do sukcesu.</p>
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="rounded-2xl opacity-40 hover:opacity-100 transition-all"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          <div className="space-y-8 text-left">
            <div className="form-control">
              <label className="label">
                <span className="label-text-alt font-display opacity-40 tracking-wider">Twój Cel</span>
              </label>
              <Textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="Np. Chciałbym nauczyć się Next.js w miesiąc i zbudować portfolio"
                className="h-44 bg-base-100/50 border-white/5 transition-all resize-none text-base p-6 rounded-2xl leading-relaxed"
              />
            </div>

            <p className="text-xs font-display opacity-40 text-center tracking-wide px-8 leading-relaxed">
              AI przeanalizuje Twój pomysł i wygeneruje konkretny cel wraz z listą kroków milowych.
            </p>

            <Button
              onClick={() => mutate(idea)}
              disabled={isPending || !idea.trim()}
              className="w-full gap-4 font-display text-lg tracking-wide shadow-[0_0_20px_rgba(123,46,255,0.2)] transition-all hover:scale-[1.01] h-14"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  AI generuje...
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  Generuj cel z AI
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
