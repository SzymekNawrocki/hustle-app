"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface UseCRUDOptions {
  extraInvalidations?: readonly (readonly unknown[])[];
}

export function useCRUD<T>(
  endpoint: string,
  queryKey: string | readonly unknown[],
  options?: UseCRUDOptions
) {
  const queryClient = useQueryClient();

  const baseKey: readonly unknown[] = typeof queryKey === "string" ? [queryKey] : queryKey;

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: baseKey });
    options?.extraInvalidations?.forEach((key) =>
      queryClient.invalidateQueries({ queryKey: key })
    );
  };

  const remove = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`${endpoint}/${id}`);
    },
    onSuccess: invalidateAll,
  });

  const update = useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: Partial<T> }) => {
      const res = await api.patch<T>(`${endpoint}/${id}`, payload);
      return res.data;
    },
    onSuccess: invalidateAll,
  });

  const create = useMutation({
    mutationFn: async (payload: Partial<T>) => {
      const res = await api.post<T>(endpoint, payload);
      return res.data;
    },
    onSuccess: invalidateAll,
  });

  return { remove, update, create };
}
