"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DashboardToday, Task, Habit } from "@/types/api";
import { CheckCircle2, Circle, ListTodo, Zap, Loader2 } from "lucide-react";

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
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const tasks = data?.tasks || [];
  const habits = data?.habits || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
        <p className="text-gray-400 mt-2">Dziś jest dobry dzień na realizację Twoich celów.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tasks Section */}
        <section className="bg-[#111114] border border-white/5 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <ListTodo className="w-5 h-5 text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold text-white">Zadania na dziś</h2>
            <span className="ml-auto text-xs font-medium text-gray-500 bg-white/5 px-2 py-1 rounded-full">
              {tasks.length}
            </span>
          </div>

          <div className="space-y-3">
            {tasks.length > 0 ? (
              tasks.map((task: Task) => (
                <div 
                  key={task.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 group hover:border-blue-500/30 transition-all cursor-pointer"
                >
                  {task.is_completed ? (
                    <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-600 shrink-0 group-hover:text-blue-400 transition-colors" />
                  )}
                  <span className={`text-gray-300 ${task.is_completed ? "line-through opacity-50" : ""}`}>
                    {task.title}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">Brak zadań na dziś.</p>
            )}
          </div>
        </section>

        {/* Habits Section */}
        <section className="bg-[#111114] border border-white/5 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Zap className="w-5 h-5 text-orange-500" />
            </div>
            <h2 className="text-xl font-semibold text-white">Nawyki</h2>
            <span className="ml-auto text-xs font-medium text-gray-500 bg-white/5 px-2 py-1 rounded-full">
              {habits.length}
            </span>
          </div>

          <div className="space-y-3">
            {habits.length > 0 ? (
              habits.map((habit: Habit) => (
                <div 
                  key={habit.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 group hover:border-orange-500/30 transition-all cursor-pointer"
                >
                  <div className="w-5 h-5 border-2 border-gray-600 rounded-lg group-hover:border-orange-400 transition-colors" />
                  <div className="flex-1">
                    <span className="text-gray-300 block">{habit.title}</span>
                    <span className="text-[10px] text-orange-500/70 font-medium uppercase tracking-wider">
                      Streak: {habit.streak} dni
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">Brak nawyków do wyświetlenia.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
