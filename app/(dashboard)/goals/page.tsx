"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Goal } from "@/types/api";
import { usePaginatedQuery } from "@/hooks/use-paginated-query";
import { useCRUD } from "@/hooks/use-crud";
import { Plus, Target, Calendar, CheckCircle2, Circle, ChevronRight, Trash2 } from "lucide-react";
import { SmartCreateModal } from "@/components/smart-create-modal";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const LIMIT = 20;

export default function GoalsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch, page, nextPage, prevPage, setPage, hasNextPage, hasPrevPage } =
    usePaginatedQuery<Goal>("goals", "/goals/", LIMIT);

  const goals = data?.items;

  const { remove: deleteGoalMutation } = useCRUD<Goal>("/goals", "goals");


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
      <div className="space-y-10 font-sans">
        <div className="space-y-3">
          <Skeleton className="h-10 w-[260px]" />
          <Skeleton className="h-4 w-[320px]" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-40 rounded-[3rem]" />
          <Skeleton className="h-72 rounded-[2.5rem]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="shadow-lg">
        <AlertDescription className="flex items-start justify-between gap-4">
          <div>
            <div className="font-medium">Error loading goals!</div>
            <div className="text-xs opacity-80">
              {(error as { response?: { data?: { detail?: string } }; message?: string })?.response?.data?.detail || (error as Error).message}
            </div>
          </div>
          <Button size="sm" onClick={() => refetch()}>
            Try again
          </Button>
        </AlertDescription>
      </Alert>
    );
  }


  return (
    <div className="space-y-10 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl lg:text-5xl font-display text-foreground tracking-tight border-l-4 border-primary pl-4">Your goals</h1>
          <p className="text-muted-foreground mt-2 font-display tracking-wide text-xs">Define and track your progress with AI.</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="shadow-[0_0_20px_rgba(123,46,255,0.2)] gap-3 font-display text-lg px-8"
          >
            <Plus className="w-5 h-5" />
            New goal
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10">
        {goals?.length === 0 && (
          <Card className="bg-card/60 backdrop-blur-md border border-border/60 p-24 text-center rounded-[3rem] shadow-2xl">
            <CardContent className="p-0">
              <div className="flex flex-col items-center gap-6 opacity-40">
                <Target className="w-24 h-24" />
                <p className="text-xl font-display tracking-wide">
                  No active goals. Start with Smart Create!
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {goals?.map((goal) => (
          <Card
            key={goal.id} 
            className="bg-card/60 backdrop-blur-md border border-border/60 shadow-2xl overflow-hidden group rounded-[2.5rem]"
          >
            <CardContent className="p-0">
              <div className="p-10 flex flex-col lg:flex-row gap-12">
                {/* Goal Info */}
                <div className="lg:w-1/3 space-y-8">
                  <div className="flex items-start justify-between">
                    <div className="p-5 bg-primary/20 rounded-2xl shadow-inner border border-white/5">
                      <Target className="w-10 h-10 text-primary" />
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={goal.status === "COMPLETED" ? "secondary" : "default"}
                        className="font-display py-3 px-4 tracking-tight"
                      >
                        {goal.status === "COMPLETED" ? "Completed" : "In progress"}
                      </Badge>
                      <Button
                        onClick={() =>
                          deleteGoalMutation.mutate(goal.id, {
                            onSuccess: () => {
                              if (goals?.length === 1 && page > 1) setPage((p) => p - 1);
                            },
                          })
                        }
                        variant="ghost"
                        size="icon"
                        className="text-destructive/60 hover:text-destructive hover:bg-destructive/10 rounded-xl"
                        disabled={deleteGoalMutation.isPending}
                      >
                        {deleteGoalMutation.isPending ? (
                          <span className="h-4 w-4 rounded-full border-2 border-current/30 border-t-current animate-spin" />
                        ) : (
                          <Trash2 className="w-6 h-6" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl lg:text-3xl font-display text-foreground leading-tight tracking-tight">{goal.title}</h2>
                    <p className="text-muted-foreground mt-6 font-display tracking-wide text-xs leading-relaxed pr-6">{goal.description}</p>
                  </div>

                  <div className="space-y-6 pt-6">
                    <div className="flex items-center justify-between font-display tracking-wide text-xs">
                      <span className="opacity-40">Your progress</span>
                      <span className="text-secondary">{goal.progress_percentage}%</span>
                    </div>
                    <div className="w-full h-4 rounded-full border border-border/60 bg-muted/40 overflow-hidden shadow-inner">
                      <div
                        className={goal.status === "COMPLETED" ? "h-full bg-secondary" : "h-full bg-primary"}
                        style={{ width: `${goal.progress_percentage}%` }}
                      />
                    </div>
                    
                    <div className="flex items-center gap-3 font-display tracking-wide text-xs text-muted-foreground bg-muted/30 p-2.5 rounded-xl w-fit border border-border/60">
                      <Calendar className="w-4 h-4" />
                      <span>Due: {goal.target_date || "N/A"}</span>
                    </div>
                  </div>
                </div>

                {/* Subtasks / Milestones */}
                <div className="lg:w-2/3 space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Milestones */}
                    <div className="space-y-6">
                       <h3 className="text-xs font-display tracking-wide opacity-40 flex items-center gap-3">
                         <ChevronRight className="w-3 h-3" /> Milestones
                       </h3>
                       <div className="space-y-4">
                         {goal.milestones?.map((m) => (
                           <button 
                            key={m.id} 
                            onClick={() => toggleMilestone(m.id)}
                            className="flex items-center gap-4 p-5 bg-background/40 backdrop-blur-sm rounded-2xl border border-border/60 w-full text-left shadow-lg group/ms"
                           >
                             {m.is_completed ? (
                               <CheckCircle2 className="w-6 h-6 text-secondary" />
                             ) : (
                               <Circle className="w-6 h-6 text-foreground/10 group-hover/ms:text-primary/50" />
                             )}
                             <span className={`font-display text-base tracking-tight ${m.is_completed ? "opacity-30 line-through" : "text-foreground"}`}>
                               {m.title}
                             </span>
                           </button>
                         ))}
                       </div>
                    </div>

                    {/* Tasks */}
                    <div className="space-y-6">
                       <h3 className="text-xs font-display tracking-wide opacity-40 flex items-center gap-3">
                         <ChevronRight className="w-3 h-3" /> Tasks (daily)
                       </h3>
                       <div className="space-y-4">
                         {goal.tasks?.map((t) => (
                           <button 
                            key={t.id} 
                            onClick={() => toggleTask(t.id)}
                            className="flex items-center gap-4 p-5 bg-muted/20 rounded-2xl border border-border/60 w-full hover:bg-secondary/5 hover:border-secondary/30 text-left group/task shadow-lg"
                           >
                             {t.is_completed ? (
                               <CheckCircle2 className="w-6 h-6 text-secondary" />
                             ) : (
                               <div className="p-0.5 rounded-full border-2 border-primary/20 group-hover/task:border-primary">
                                 <Circle className="w-4 h-4 text-transparent" />
                               </div>
                             )}
                             <span className={`font-display text-base tracking-tight ${t.is_completed ? "opacity-30 line-through" : "text-foreground"}`}>
                               {t.title}
                             </span>
                           </button>
                         ))}
                         <Button
                           variant="outline"
                           className="w-full border-2 border-dashed border-white/5 mt-4 opacity-40 hover:text-primary font-display tracking-wide text-xs rounded-2xl"
                         >
                           + Add task
                         </Button>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {data && data.pages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={prevPage}
            disabled={!hasPrevPage}
            className="font-display tracking-wide text-xs"
          >
            ← Prev
          </Button>
          <span className="text-xs font-display opacity-40 tracking-wide">
            {page} / {data.pages} &nbsp;·&nbsp; {data.total} goals
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={nextPage}
            disabled={!hasNextPage}
            className="font-display tracking-wide text-xs"
          >
            Next →
          </Button>
        </div>
      )}

      <SmartCreateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
