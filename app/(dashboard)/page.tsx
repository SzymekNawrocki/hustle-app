"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DashboardToday, Task, Habit } from "@/types/api";
import { 
  CheckCircle2, 
  Circle, 
  ListTodo, 
  Zap, 
  Rocket, 
  Calendar, 
  Sparkles, 
  BarChart3 
} from "lucide-react";
import HustleInput from "@/components/finance/HustleInput";

export default function DashboardPage() {
  const { data, isLoading } = useQuery<DashboardToday>({
    queryKey: ["dashboard-today"],
    queryFn: async () => {
      const response = await api.get("/goals/dashboard/today");
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="loading loading-ring loading-lg text-primary"></span>
      </div>
    );
  }

  const tasks = data?.tasks || [];
  const habits = data?.habits || [];

  const items = [
    ...tasks.map(task => ({ ...task, category: 'ZADANIE' })),
    ...habits.map(habit => ({ ...habit, category: 'NAWYK' })),
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl font-display text-base-content tracking-tight mb-2">Dashboard</h1>
          <p className="text-sm text-base-content/60 font-sans">Witaj z powrotem! Oto podsumowanie Twojego dnia.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-base-200 rounded-xl border border-white/5 shadow-2xl">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div className="text-right">
            <p className="text-[10px] font-display opacity-40 tracking-wider">Dzisiaj jest</p>
            <p className="font-display text-lg tracking-tight">{new Date().toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="card bg-base-200/50 backdrop-blur-md border border-white/5 shadow-2xl">
            <div className="card-body p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="card-title text-xl font-display text-base-content tracking-wide">Zadania na dziś</h2>
                <button className="btn btn-ghost btn-sm text-primary font-display tracking-tight">Pokaż wszystkie</button>
              </div>
              <div className="space-y-4 font-sans">
                {items.filter(i => i.category === 'ZADANIE').map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-base-100/50 rounded-2xl border border-white/5 hover:border-primary/50 hover:bg-base-300/50 transition-all group">
                    <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary group-hover:text-primary-content transition-colors shadow-[0_0_15px_rgba(123,46,255,0.3)]">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-base-content">{item.title}</p>
                      <p className="text-[9px] font-display opacity-50 tracking-wide">Deadline: Dzisiaj, 18:00</p>
                    </div>
                    <div className="badge badge-outline border-white/10 font-display px-3 py-3 tracking-tighter whitespace-nowrap">W toku</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card bg-base-200/50 backdrop-blur-md border border-white/5 shadow-2xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-secondary to-transparent opacity-100" />
            <div className="card-body p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="card-title text-xl font-display text-base-content tracking-wide">Nawyki</h2>
                <Sparkles className="w-5 h-5 text-secondary animate-pulse" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
                {items.filter(i => i.category === 'NAWYK').map((item) => (
                  <div key={item.id} className="p-4 bg-base-100/50 rounded-2xl border border-white/5">
                    <div className="flex items-center justify-between mb-3 font-display">
                      <span className="text-[9px] text-secondary tracking-wider">
                        Codziennie
                      </span>
                      <span className="text-xs opacity-60">75%</span>
                    </div>
                    <p className="text-base-content mb-3 tracking-tight">{item.title}</p>
                    <div className="w-full bg-base-300 rounded-full h-2 overflow-hidden border border-white/5">
                        <div className="bg-secondary h-full rounded-full w-3/4 shadow-[0_0_15px_rgba(0,212,255,0.5)]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="card bg-primary text-primary-content shadow-[0_0_50px_rgba(123,46,255,0.2)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <BarChart3 className="w-32 h-32" />
            </div>
            <div className="card-body p-8 relative">
              <h3 className="text-[10px] font-display mb-4 tracking-wider opacity-80">AI Insight</h3>
              <p className="text-xl font-display leading-tight mb-6">
                "Twoja produktywność wzrosła o 15%. Trzymaj to tempo!"
              </p>
              <div className="flex items-center gap-2 text-[9px] font-display opacity-80 border-t border-primary-content/20 pt-4 tracking-tight">
                <Zap className="w-4 h-4 fill-current" />
                Analiza skończona 5 min temu
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
            <HustleInput type="INCOME" />
            <HustleInput type="EXPENSE" />
          </div>

          <div className="card bg-base-200/50 backdrop-blur-md border border-white/5 shadow-2xl">
             <div className="card-body p-6">
                <h3 className="card-title text-xs font-display mb-4 tracking-wider opacity-40">Szybki podgląd</h3>
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <p className="text-[10px] font-display tracking-wider opacity-60">Finanse</p>
                      <p className={`text-lg font-display tracking-tighter ${data?.finance_balance && data.finance_balance >= 0 ? 'text-secondary' : 'text-error'}`}>
                        {data?.finance_balance ? (data.finance_balance > 0 ? `+${data.finance_balance}` : data.finance_balance) : '0'} zł
                      </p>
                   </div>
                   <div className="flex items-center justify-between">
                      <p className="text-[10px] font-display tracking-wider opacity-60">Zdrowie</p>
                      <p className="text-lg font-display text-secondary tracking-tighter">{Math.round(data?.health_calories || 0)} kcal</p>
                   </div>
                   <div className="flex items-center justify-between">
                      <p className="text-[10px] font-display tracking-wider opacity-60">Cele</p>
                      <p className="text-lg font-display text-secondary tracking-tighter">{data?.active_goals_count || 0} aktywne</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
