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
    <div className="space-y-10 animate-in fade-in duration-700 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl lg:text-5xl font-display text-base-content tracking-tight border-l-4 border-primary pl-4">Twoje cele</h1>
          <p className="text-base-content/60 mt-2 font-display tracking-wide text-[9px]">Zdefiniuj i monitoruj swoje postępy z AI.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary btn-md shadow-[0_0_20px_rgba(123,46,255,0.2)] gap-3 font-display text-lg px-8 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-5 h-5" />
            Nowy cel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10">
        {goals?.length === 0 && (
          <div className="card bg-base-200/50 backdrop-blur-md border border-white/5 p-24 text-center rounded-[3rem] shadow-2xl">
             <div className="flex flex-col items-center gap-6 opacity-40">
                <Target className="w-24 h-24" />
                <p className="text-xl font-display tracking-wide">Brak aktywnych celów. Zacznij od Smart Create!</p>
             </div>
          </div>
        )}

        {goals?.map((goal) => (
          <div 
            key={goal.id} 
            className="card bg-base-200/50 backdrop-blur-md border border-white/5 shadow-2xl overflow-hidden group rounded-[2.5rem]"
          >
            <div className="h-2 bg-gradient-to-r from-primary via-secondary to-primary animate-gradient bg-[length:200%_auto]" />
            <div className="card-body p-0">
              <div className="p-10 flex flex-col lg:flex-row gap-12">
                {/* Goal Info */}
                <div className="lg:w-1/3 space-y-8">
                  <div className="flex items-start justify-between">
                    <div className="p-5 bg-primary/20 rounded-2xl shadow-inner border border-white/5">
                      <Target className="w-10 h-10 text-primary" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`badge font-display py-3 px-4 tracking-tight ${
                        goal.status === "COMPLETED" ? "badge-secondary" : "badge-primary"
                      }`}>
                        {goal.status === "COMPLETED" ? "Ukończono" : "W toku"}
                      </div>
                      <button
                        onClick={() => deleteGoalMutation.mutate(goal.id)}
                        className="btn btn-ghost btn-md text-error/20 hover:text-error hover:bg-error/10 transition-all rounded-xl"
                        disabled={deleteGoalMutation.isPending}
                      >
                        {deleteGoalMutation.isPending ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Trash2 className="w-6 h-6" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl lg:text-3xl font-display text-base-content leading-tight tracking-tight">{goal.title}</h2>
                    <p className="text-base-content/60 mt-6 font-display tracking-wide text-[9px] leading-relaxed pr-6">{goal.description}</p>
                  </div>

                  <div className="space-y-6 pt-6">
                    <div className="flex items-center justify-between font-display tracking-wider text-[9px]">
                      <span className="opacity-40">Twój postęp</span>
                      <span className="text-secondary">{goal.progress_percentage}%</span>
                    </div>
                    <progress 
                      className={`progress w-full h-4 shadow-inner border border-white/5 rounded-full ${goal.status === "COMPLETED" ? "progress-secondary" : "progress-primary"}`} 
                      value={goal.progress_percentage} 
                      max="100"
                    ></progress>
                    
                    <div className="flex items-center gap-3 font-display tracking-wide text-[9px] opacity-30 bg-base-300/50 p-2.5 rounded-xl w-fit border border-white/5">
                      <Calendar className="w-4 h-4" />
                      <span>Termin: {goal.target_date || "Brak"}</span>
                    </div>
                  </div>
                </div>

                {/* Subtasks / Milestones */}
                <div className="lg:w-2/3 space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Milestones */}
                    <div className="space-y-6">
                       <h3 className="text-[9px] font-display tracking-widest opacity-30 flex items-center gap-3">
                         <ChevronRight className="w-3 h-3" /> Etapy (Milestones)
                       </h3>
                       <div className="space-y-4">
                         {goal.milestones?.map((m) => (
                           <button 
                            key={m.id} 
                            onClick={() => toggleMilestone(m.id)}
                            className="flex items-center gap-4 p-5 bg-base-100/50 backdrop-blur-sm rounded-2xl border border-white/5 w-full hover:bg-primary/5 hover:border-primary/20 transition-all text-left shadow-lg group/ms"
                           >
                             {m.is_completed ? (
                               <CheckCircle2 className="w-6 h-6 text-secondary" />
                             ) : (
                               <Circle className="w-6 h-6 text-base-content/10 group-hover/ms:text-primary/40" />
                             )}
                             <span className={`font-display text-base tracking-tight ${m.is_completed ? "opacity-30 line-through" : "text-base-content"}`}>
                               {m.title}
                             </span>
                           </button>
                         ))}
                       </div>
                    </div>

                    {/* Tasks */}
                    <div className="space-y-6">
                       <h3 className="text-[9px] font-display tracking-widest opacity-30 flex items-center gap-3">
                         <ChevronRight className="w-3 h-3" /> Zadania (Daily)
                       </h3>
                       <div className="space-y-4">
                         {goal.tasks?.map((t) => (
                           <button 
                            key={t.id} 
                            onClick={() => toggleTask(t.id)}
                            className="flex items-center gap-4 p-5 bg-base-300/30 rounded-2xl border border-white/5 w-full hover:bg-secondary/5 hover:border-secondary/20 transition-all text-left group/task shadow-lg"
                           >
                             {t.is_completed ? (
                               <CheckCircle2 className="w-6 h-6 text-secondary" />
                             ) : (
                               <div className="p-0.5 rounded-full border-2 border-primary/20 group-hover/task:border-primary transition-colors">
                                 <Circle className="w-4 h-4 text-transparent" />
                               </div>
                             )}
                             <span className={`font-display text-base tracking-tight ${t.is_completed ? "opacity-30 line-through" : "text-base-content"}`}>
                               {t.title}
                             </span>
                           </button>
                         ))}
                         <button className="btn btn-ghost btn-block btn-md border-2 border-dashed border-white/5 mt-4 opacity-40 hover:opacity-100 hover:text-primary hover:border-primary/40 font-display tracking-wider text-[10px] transition-all rounded-2xl">
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
