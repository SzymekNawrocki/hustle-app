"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Wallet, Loader2, Send, Landmark } from "lucide-react";
import { Expense } from "@/types/api";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface HustleInputProps {
  type: "EXPENSE" | "INCOME";
}

export default function HustleInput({ type }: HustleInputProps) {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();

  const isIncome = type === "INCOME";

  const hustleMutation = useMutation({
    mutationFn: async (input: string) => {
      const response = await api.post<Expense>("/finance/hustle-input", { 
        text: input,
        forced_category: isIncome ? "INCOME" : null
      });
      return response.data;
    },
    onSuccess: (data) => {
      setStatus("success");
      setMessage(`Saved: ${data.amount} PLN (${data.category})`);
      setText("");
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-today"] });
      setTimeout(() => setStatus("idle"), 3000);
    },
    onError: (err: any) => {
      setStatus("error");
      setMessage(err.response?.data?.detail || "Parsing error. Try a different phrasing.");
      setTimeout(() => setStatus("idle"), 5000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || hustleMutation.isPending) return;
    hustleMutation.mutate(text);
  };

  return (
    <Card className={`bg-base-200/50 backdrop-blur-xl border border-white/5 shadow-2xl relative overflow-hidden group transition-all ${isIncome ? 'hover:border-success/30' : 'hover:border-primary/30'}`}>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg ${isIncome ? 'bg-success/10 text-success shadow-[0_0_15px_rgba(34,197,94,0.2)]' : 'bg-primary/10 text-primary shadow-[0_0_15px_rgba(123,46,255,0.2)]'}`}>
            {isIncome ? <Landmark className="w-5 h-5" /> : <Wallet className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-sm font-display tracking-wider uppercase">{isIncome ? 'Cash inflow' : 'Hustle expense'}</h3>
            <p className="text-xs opacity-50 font-sans uppercase tracking-wide">{isIncome ? 'Salary, transfer, bonus' : 'Courses, food, lifestyle...'}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="relative">
          <Input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={isIncome ? "e.g. 5000 PLN salary..." : "e.g. 50 PLN for pizza..."}
            className={`w-full bg-base-100/50 border-white/5 transition-all font-sans text-sm py-6 rounded-2xl pr-12 h-14 focus:ring-1 ${isIncome ? 'focus:ring-success border-success/20' : 'focus:ring-primary border-primary/20'}`}
            disabled={hustleMutation.isPending}
          />
          <Button
            type="submit"
            disabled={hustleMutation.isPending || !text.trim()}
            size="icon"
            className={`absolute right-2 top-2 h-10 w-10 p-0 rounded-xl transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 ${isIncome ? 'bg-success hover:bg-success/90 text-success-content shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'shadow-[0_0_15px_rgba(123,46,255,0.3)]'}`}
          >
            {hustleMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>

        {status !== "idle" && (
          <div className={`mt-3 text-xs font-display animate-in fade-in slide-in-from-top-1 ${status === 'success' ? 'text-success' : 'text-error'}`}>
            {message}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
