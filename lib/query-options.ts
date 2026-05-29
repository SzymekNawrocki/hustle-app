import { queryOptions } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { DashboardToday } from "@/types/api";

// Stable base keys — used both by queryOptions and for prefix-invalidation of paginated variants
export const KEYS = {
  dashboard: ["dashboard-today"] as const,
  goals:     ["goals"] as const,
  expenses:  ["expenses"] as const,
  meals:     ["meals"] as const,
  offers:    ["offers"] as const,
} as const;

export const dashboardQueryOptions = queryOptions({
  queryKey: KEYS.dashboard,
  queryFn:  async () => {
    const res = await api.get<DashboardToday>("/goals/dashboard/today");
    return res.data;
  },
});
