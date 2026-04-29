"use client";

import { useCurrentUser } from "./use-current-user";

export function useAuth() {
  const { data: user, isLoading } = useCurrentUser();
  return {
    isAuthenticated: !!user,
    isLoading,
    user,
  };
}
