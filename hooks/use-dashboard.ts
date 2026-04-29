"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { DashboardToday } from "@/types/api";

export function useDashboard() {
  return useQuery<DashboardToday>({
    queryKey: ["dashboard-today"],
    queryFn: async () => {
      const res = await api.get<DashboardToday>("/goals/dashboard/today");
      return res.data;
    },
  });
}
