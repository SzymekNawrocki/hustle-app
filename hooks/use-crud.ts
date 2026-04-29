"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface UseCRUDOptions {
  /** Additional query keys to invalidate on any mutation success. */
  extraInvalidations?: string[][];
}

/**
 * Provides create / update / remove mutations for a REST endpoint.
 * All three automatically invalidate `queryKey` (and any extraInvalidations)
 * on success — component-specific side effects can be added per-call via the
 * second argument of `mutate(payload, { onSuccess: ... })`.
 */
export function useCRUD<T>(
  endpoint: string,
  queryKey: string,
  options?: UseCRUDOptions
) {
  const queryClient = useQueryClient();

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: [queryKey] });
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
