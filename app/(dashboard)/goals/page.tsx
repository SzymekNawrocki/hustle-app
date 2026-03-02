"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Goal } from "@/types/api";
import { Plus, Target, Sparkles, Loader2, Calendar, CheckCircle2, Circle, ChevronRight, Trash2 } from "lucide-react";
import { SmartCreateModal } from "@/components/smart-create-modal";

export default function GoalsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedGoal, setExpandedGoal] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data: goals, isLoading, error, refetch } = useQuery<Goal[]>({
    queryKey: ["goals"],
    queryFn: async () => {
      console.log("DEBUG: Fetching goals...");
      try {
        const response = await api.get("/goals/");
        console.log("DEBUG: Goals data received:", response.data);
        return response.data;
      } catch (err: any) {
        console.error("DEBUG: Failed to fetch goals:", err.response?.data || err.message);
        throw err;
      }
    },
  });

  const deleteGoalMutation = useMutation({
    mutationFn: async (goalId: number) => {
      await api.delete(`/goals/${goalId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
    onError: (err) => {
      console.error("Failed to delete goal:", err);
    },
  });


  const toggleTask = async (taskId: number) => {
     try {
       await api.post(`/goals/tasks/${taskId}/toggle`);
       refetch();
     } catch (err) {
       console.error("Failed to toggle task:", err);
     }
  };

  const toggleMilestone = async (milestoneId: number) => {
    try {
      await api.post(`/goals/milestones/${milestoneId}/toggle`);
      refetch();
    } catch (err) {
      console.error("Failed to toggle milestone:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="loading loading-ring loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error shadow-lg">
        <div>
          <h3 className="font-bold">Błąd podczas ładowania celów!</h3>
          <div className="text-xs">{(error as any)?.response?.data?.detail || (error as any).message}</div>
        </div>
        <div className="flex-none">
          <button className="btn btn-sm" onClick={() => refetch()}>Spróbuj ponownie</button>
        </div>
      </div>
    );
  }


  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-base-content tracking-tight">Twoje Cele</h1>
          <p className="text-base-content/60 mt-2 font-medium">Zdefiniuj i monitoruj swoje postępy z AI.</p>
        </div>
        <div className="flex gap-3">
           <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-outline btn-lg gap-2 font-bold"
          >
            <Sparkles className="w-6 h-6 text-primary" />
            Smart Create
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary btn-lg shadow-xl gap-2 font-bold"
          >
            <Plus className="w-6 h-6" />
            Nowy cel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {goals?.length === 0 && (
          <div className="card bg-base-200 border-2 border-dashed border-base-300 p-20 text-center">
             <div className="flex flex-col items-center gap-4 opacity-40">
                <Target className="w-16 h-16" />
                <p className="text-xl font-bold">Brak aktywnych celów. Zacznij od Smart Create!</p>
             </div>
          </div>
        )}

        {goals?.map((goal) => (
          <div 
            key={goal.id} 
            className="card bg-base-200 border border-base-300 shadow-xl overflow-hidden group"
          >
            <div className="h-1 bg-gradient-to-r from-primary/50 to-secondary/50" />
            <div className="card-body p-0">
              <div className="p-8 flex flex-col lg:flex-row gap-8">
                {/* Goal Info */}
                <div className="lg:w-1/3 space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="p-4 bg-primary/10 rounded-2xl">
                      <Target className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`badge font-bold py-4 px-4 ${
                        goal.status === "COMPLETED" ? "badge-success" : "badge-info"
                      }`}>
                        {goal.status === "COMPLETED" ? "Ukończono" : "W toku"}
                      </div>
                      <button
                        onClick={() => deleteGoalMutation.mutate(goal.id)}
                        className="btn btn-ghost btn-sm text-error hover:bg-error/10"
                        disabled={deleteGoalMutation.isPending}
                      >
                        {deleteGoalMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-3xl font-bold text-base-content leading-tight">{goal.title}</h2>
                    <p className="text-base-content/60 mt-4 font-medium leading-relaxed">{goal.description}</p>
                  </div>

                  <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between text-sm font-bold">
                      <span className="opacity-40 uppercase tracking-wider text-[10px]">Twój postęp</span>
                      <span className="text-primary">{goal.progress_percentage}%</span>
                    </div>
                    <progress 
                      className={`progress w-full h-4 shadow-inner ${goal.status === "COMPLETED" ? "progress-success" : "progress-primary"}`} 
                      value={goal.progress_percentage} 
                      max="100"
                    ></progress>
                    
                    <div className="flex items-center gap-3 text-xs font-bold opacity-40">
                      <Calendar className="w-4 h-4" />
                      <span>Termin: {goal.target_date || "Brak"}</span>
                    </div>
                  </div>
                </div>

                {/* Subtasks / Milestones */}
                <div className="lg:w-2/3 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Milestones */}
                    <div className="space-y-4">
                       <h3 className="text-xs font-bold uppercase tracking-widest opacity-30 flex items-center gap-2">
                         <ChevronRight className="w-4 h-4" /> Etapy (Milestones)
                       </h3>
                       <div className="space-y-3">
                         {goal.milestones?.map((m) => (
                           <button 
                            key={m.id} 
                            onClick={() => toggleMilestone(m.id)}
                            className="flex items-center gap-3 p-4 bg-base-100/50 rounded-xl border border-base-300/50 w-full hover:bg-base-100 transition-all text-left"
                           >
                             {m.is_completed ? (
                               <CheckCircle2 className="w-5 h-5 text-success" />
                             ) : (
                               <Circle className="w-5 h-5 text-base-content/20" />
                             )}
                             <span className={`text-sm font-bold ${m.is_completed ? "opacity-40 line-through" : ""}`}>
                               {m.title}
                             </span>
                           </button>
                         ))}
                       </div>
                    </div>

                    {/* Tasks */}
                    <div className="space-y-4">
                       <h3 className="text-xs font-bold uppercase tracking-widest opacity-30 flex items-center gap-2">
                         <ChevronRight className="w-4 h-4" /> Lista zadań (Daily Actions)
                       </h3>
                       <div className="space-y-3">
                         {goal.tasks?.map((t) => (
                           <button 
                            key={t.id} 
                            onClick={() => toggleTask(t.id)}
                            className="flex items-center gap-3 p-4 bg-base-300/30 rounded-xl border border-base-300/50 w-full hover:bg-base-300 transition-all text-left group/task"
                           >
                             {t.is_completed ? (
                               <CheckCircle2 className="w-5 h-5 text-success" />
                             ) : (
                               <div className="p-0.5 rounded-full border-2 border-primary/40 group-hover/task:border-primary transition-colors">
                                 <Circle className="w-4 h-4 text-transparent" />
                               </div>
                             )}
                             <span className={`text-sm font-semibold flex-1 ${t.is_completed ? "opacity-40 line-through font-medium" : ""}`}>
                               {t.title}
                             </span>
                           </button>
                         ))}
                         <button className="btn btn-ghost btn-block btn-sm border-dashed border-base-300 mt-2 opacity-50 hover:opacity-100">
                            + Dodaj zadanie
                         </button>
                       </div>
                    </div>
                  </div>
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
