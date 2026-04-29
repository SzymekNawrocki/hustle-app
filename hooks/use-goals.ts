"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Milestone, Task } from "@/types/api";

export function useGoals() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["goals"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard-today"] });
  };

  const toggleTask = useMutation({
    mutationFn: async (taskId: number) => {
      const res = await api.post<Task>(`/goals/tasks/${taskId}/toggle`);
      return res.data;
    },
    onSuccess: invalidate,
  });

  const toggleMilestone = useMutation({
    mutationFn: async (milestoneId: number) => {
      const res = await api.post<Milestone>(`/goals/milestones/${milestoneId}/toggle`);
      return res.data;
    },
    onSuccess: invalidate,
  });

  return { toggleTask, toggleMilestone };
}
