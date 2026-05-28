"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { CURRENT_USER_KEY } from "./use-current-user";

export function useAccount() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const updateProfile = useMutation({
    mutationFn: async (data: { full_name: string }) => {
      const res = await api.patch("/auth/me", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CURRENT_USER_KEY });
    },
  });

  const changePassword = useMutation({
    mutationFn: async (data: { current_password: string; new_password: string }) => {
      await api.post("/auth/change-password", data);
    },
    onSuccess: async () => {
      await fetch("/api/auth/session", { method: "DELETE" }).catch(() => {});
      queryClient.clear();
      router.push("/login");
    },
  });

  const deleteAccount = useMutation({
    mutationFn: async (data: { password: string }) => {
      await api.delete("/auth/me", { data });
    },
    onSuccess: async () => {
      await fetch("/api/auth/session", { method: "DELETE" }).catch(() => {});
      queryClient.clear();
      router.push("/login");
    },
  });

  return { updateProfile, changePassword, deleteAccount };
}
