"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardQueryOptions } from "@/lib/query-options";

export function useDashboard() {
  return useQuery(dashboardQueryOptions);
}
