"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Goal } from "@/types/api";
import { Plus, Target, Sparkles, Loader2, Calendar } from "lucide-react";
import { SmartCreateModal } from "@/components/smart-create-modal";

export default function GoalsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: goals, isLoading } = useQuery<Goal[]>({
    queryKey: ["goals"],
    queryFn: async () => {
      const response = await api.get("/goals/");
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

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Twoje Cele</h1>
          <p className="text-gray-400 mt-2">Zdefiniuj i monitoruj swoje postępy.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-900/20 transition-all active:scale-[0.95]"
        >
          <Plus className="w-5 h-5" />
          Dodaj cel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Smart Create Promotion Card */}
        <div 
          onClick={() => setIsModalOpen(true)}
          className="group relative bg-gradient-to-br from-blue-900/20 to-cyan-900/10 border border-blue-500/20 rounded-2xl p-6 cursor-pointer hover:border-blue-500/40 transition-all flex flex-col justify-center items-center text-center space-y-4"
        >
          <div className="p-4 bg-blue-500/10 rounded-full group-hover:scale-110 transition-transform">
            <Sparkles className="w-8 h-8 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Smart Create z AI</h3>
            <p className="text-sm text-gray-500 mt-1">Pozwól AI przygotować Twój plan działania.</p>
          </div>
        </div>

        {goals?.map((goal) => (
          <div 
            key={goal.id} 
            className="bg-[#111114] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all space-y-6 flex flex-col"
          >
            <div className="flex items-start justify-between">
              <div className="p-2 bg-white/5 rounded-lg">
                <Target className="w-5 h-5 text-gray-400" />
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest ${
                goal.status === "COMPLETED" ? "bg-green-500/10 text-green-500" : "bg-blue-500/10 text-blue-500"
              }`}>
                {goal.status}
              </span>
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-bold text-white line-clamp-1">{goal.title}</h3>
              <p className="text-sm text-gray-500 mt-2 line-clamp-2">{goal.description}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Postęp</span>
                <span className="text-white font-medium">{goal.progress_percentage}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                  style={{ width: `${goal.progress_percentage}%` }}
                />
              </div>
              
              <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-white/5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{goal.target_date || "Brak terminu"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <SmartCreateModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
