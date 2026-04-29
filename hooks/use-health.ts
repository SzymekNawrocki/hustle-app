"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { MealLog } from "@/types/api";
import { usePaginatedQuery } from "./use-paginated-query";
import { useCRUD } from "./use-crud";

export function useHealth() {
  const queryClient = useQueryClient();

  const meals = usePaginatedQuery<MealLog>("meals", "/health/meals");

  const { remove: deleteMeal } = useCRUD<MealLog>("/health/meals", "meals", {
    extraInvalidations: [["dashboard-today"]],
  });

  const logMeal = useMutation({
    mutationFn: async (text: string) => {
      const res = await api.post<MealLog>("/health/log-meal-ai", { text });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-today"] });
    },
  });

  return { meals, deleteMeal, logMeal };
}
