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
        <span className="loading loading-ring loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-base-content tracking-tight">Twoje Cele</h1>
          <p className="text-base-content/60 mt-2 font-medium">Zdefiniuj i monitoruj swoje postępy.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary btn-lg shadow-xl gap-2 font-bold"
        >
          <Plus className="w-6 h-6" />
          Dodaj cel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
        {/* Smart Create Promotion Card */}
        <div 
          onClick={() => setIsModalOpen(true)}
          className="card bg-base-200 border border-primary/30 shadow-xl cursor-pointer hover:border-primary/60 transition-all group overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
          <div className="card-body items-center text-center p-8 space-y-4">
            <div className="p-5 bg-primary/10 rounded-full group-hover:scale-110 transition-transform shadow-inner border border-primary/20">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h3 className="card-title text-2xl font-bold text-base-content justify-center tracking-tight">Smart Create</h3>
              <p className="text-base-content/60 mt-2 font-medium">Pozwól AI przygotować Twój plan działania.</p>
            </div>
            <div className="card-actions mt-2">
              <div className="badge badge-primary font-bold px-4 py-3">Polecane</div>
            </div>
          </div>
        </div>

        {goals?.map((goal) => (
          <div 
            key={goal.id} 
            className="card bg-base-200 border border-base-300 shadow-xl hover:border-primary/30 transition-all group"
          >
            <div className="card-body p-6 space-y-6 flex flex-col">
              <div className="flex items-start justify-between">
                <div className="p-3 bg-base-300/50 rounded-xl group-hover:bg-primary/10 transition-colors">
                  <Target className="w-6 h-6 text-base-content/40 group-hover:text-primary transition-colors" />
                </div>
                <span className={`badge font-bold py-3 px-3 shadow-sm ${
                  goal.status === "COMPLETED" ? "badge-success" : "badge-info"
                }`}>
                  {goal.status === "COMPLETED" ? "Ukończono" : "W toku"}
                </span>
              </div>

              <div className="flex-1">
                <h3 className="card-title text-xl font-bold text-base-content line-clamp-1">{goal.title}</h3>
                <p className="text-sm opacity-60 mt-3 line-clamp-2 font-medium leading-relaxed">{goal.description}</p>
              </div>

              <div className="space-y-4 pt-4 border-t border-base-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold opacity-40">Postęp</span>
                  <span className="text-sm font-bold text-primary">{goal.progress_percentage}%</span>
                </div>
                <progress 
                  className={`progress w-full h-3 shadow-inner ${goal.status === "COMPLETED" ? "progress-success" : "progress-primary"}`} 
                  value={goal.progress_percentage} 
                  max="100"
                ></progress>
                
                <div className="flex items-center gap-2 text-[10px] font-bold opacity-40 pt-2">
                  <Calendar className="w-4 h-4" />
                  <span>{goal.target_date || "Brak terminu"}</span>
                </div>
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
