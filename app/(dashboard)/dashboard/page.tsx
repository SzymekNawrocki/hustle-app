"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DashboardToday } from "@/types/api";

export default function DashboardPage() {
  const { data, isLoading } = useQuery<DashboardToday>({
    queryKey: ["dashboard-today"],
    queryFn: async () => {
      const response = await api.get("/goals/dashboard/today");
      return response.data;
    },
  });

  if (isLoading) return <div className="p-10">Ładowanie...</div>;

  const stats = [
    { label: "Aktywne Cele", value: `${data?.active_goals_count || 0}`, color: "text-blue-500" },
    { label: "Finanse (Dziś)", value: `${data?.finance_balance || 0} zł`, color: data?.finance_balance && data.finance_balance >= 0 ? "text-emerald-500" : "text-error" },
    { label: "Dzisiejsze Kalorie", value: `${Math.round(data?.health_calories || 0)} kcal`, color: "text-orange-500" },
    { label: "Nawyki", value: `${data?.habits.length || 0}`, color: "text-cyan-500" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display text-white tracking-tight">Witaj w HustleOS</h1>
        <p className="text-gray-400 mt-2 font-display text-[9px] tracking-wide">Oto podsumowanie Twoich postępów.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-[#111114] border border-white/5 p-6 rounded-2xl">
            <p className="text-[10px] font-display text-gray-500 tracking-wider whitespace-nowrap">{stat.label}</p>
            <p className={`text-2xl font-display mt-2 ${stat.color} tracking-tighter`}>{stat.value}</p>
          </div>
        ))}
      </div>
      
      <div className="h-96 bg-[#111114] border border-white/5 rounded-2xl flex items-center justify-center">
        <p className="text-gray-600 font-display text-xs">Nadchodzący wykres aktywności...</p>
      </div>
    </div>
  );
}
