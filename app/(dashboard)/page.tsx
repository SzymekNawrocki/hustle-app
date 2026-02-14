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

  // Create a combined items array with categories
  const items = [
    ...tasks.map(task => ({ ...task, category: 'ZADANIE' })),
    ...habits.map(habit => ({ ...habit, category: 'NAWYK' })),
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-base-content tracking-tight mb-2">Dashboard</h1>
          <p className="text-base-content/60 font-medium">Witaj z powrotem! Oto podsumowanie Twojego dnia.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-base-200 rounded-xl border border-base-300 shadow-sm">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold opacity-40">Dzisiaj jest</p>
            <p className="font-bold">{new Date().toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Zadania i Nawyki - Główna kolumna */}
        <div className="lg:col-span-2 space-y-8">
          {/* Zadania */}
          <div className="card bg-base-200 border border-base-300 shadow-xl">
            <div className="card-body p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="card-title text-xl font-bold text-base-content tracking-tight">Zadania na dziś</h2>
                <button className="btn btn-ghost btn-sm text-primary font-bold">Pokaż wszystkie</button>
              </div>
              <div className="space-y-4">
                {items.filter(i => i.category === 'ZADANIE').map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-base-100 rounded-2xl border border-base-300 hover:border-primary/30 transition-all group">
                    <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary group-hover:text-primary-content transition-colors">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-base-content">{item.title}</p>
                      <p className="text-xs font-medium opacity-50">Deadline: Dzisiaj, 18:00</p>
                    </div>
                    <div className="badge badge-outline border-base-300 font-bold px-3 py-3">W toku</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Nawyki */}
          <div className="card bg-base-200 border border-base-300 shadow-xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-secondary to-transparent opacity-50" />
            <div className="card-body p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="card-title text-xl font-bold text-base-content tracking-tight">Nawyki</h2>
                <Sparkles className="w-5 h-5 text-secondary" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {items.filter(i => i.category === 'NAWYK').map((item) => (
                  <div key={item.id} className="p-4 bg-base-100 rounded-2xl border border-base-300">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold text-secondary">
                        Codziennie
                      </span>
                      <span className="text-xs font-medium opacity-40">75%</span>
                    </div>
                    <p className="font-bold text-base-content mb-3">{item.title}</p>
                    <div className="w-full bg-base-200 rounded-full h-1.5 overflow-hidden border border-base-300">
                        <div className="bg-secondary h-full rounded-full w-3/4 shadow-[0_0_8px_rgba(var(--color-secondary),0.4)]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AI Insights & Szybkie Statystyki - Boczna kolumna */}
        <div className="space-y-8">
          <div className="card bg-primary text-primary-content shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <BarChart3 className="w-32 h-32" />
            </div>
            <div className="card-body p-8 relative">
              <h3 className="text-xs font-bold mb-4">AI Insight</h3>
              <p className="text-lg font-medium leading-relaxed mb-6">
                "Twoja produktywność wzrosła o 15% w porównaniu do zeszłego tygodnia. Skup się dzisiaj na dokończeniu kluczowych zadań przed 16:00."
              </p>
              <div className="flex items-center gap-2 text-xs font-bold opacity-80 border-t border-primary-content/20 pt-4">
                <Zap className="w-4 h-4 fill-current" />
                Analiza skończona 5 min temu
              </div>
            </div>
          </div>

          <div className="card bg-base-200 border border-base-300 shadow-xl">
             <div className="card-body p-6">
                <h3 className="card-title text-sm font-bold mb-4 opacity-50">Szybki podgląd</h3>
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <p className="text-xs font-medium">Finanse</p>
                      <p className="text-sm font-bold text-success">+2,400 zł</p>
                   </div>
                   <div className="flex items-center justify-between">
                      <p className="text-xs font-medium">Zdrowie</p>
                      <p className="text-sm font-bold">1,850 kcal</p>
                   </div>
                   <div className="flex items-center justify-between">
                      <p className="text-xs font-medium">Cele</p>
                      <p className="text-sm font-bold">4 ukończone</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
