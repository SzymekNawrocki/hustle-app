"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { User } from "@/types/api";

export const CURRENT_USER_KEY = ["currentUser"] as const;

export function useCurrentUser() {
  return useQuery<User>({
    queryKey: CURRENT_USER_KEY,
    queryFn: async () => {
      const res = await api.get<User>("/auth/me");
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
