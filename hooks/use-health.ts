"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { MealLog } from "@/types/api";
import { usePaginatedQuery } from "./use-paginated-query";
import { useCRUD } from "./use-crud";
import { KEYS } from "@/lib/query-options";

export function useHealth() {
  const queryClient = useQueryClient();

  const meals = usePaginatedQuery<MealLog>(KEYS.meals, "/health/meals");

  const { remove: deleteMeal } = useCRUD<MealLog>("/health/meals", KEYS.meals, {
    extraInvalidations: [KEYS.dashboard],
  });

  const logMeal = useMutation({
    mutationFn: async (text: string) => {
      const res = await api.post<MealLog>("/health/log-meal-ai", { text });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.meals });
      queryClient.invalidateQueries({ queryKey: KEYS.dashboard });
    },
  });

  return { meals, deleteMeal, logMeal };
}
