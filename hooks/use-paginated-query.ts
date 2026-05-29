"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Paginated } from "@/types/api";

export function usePaginatedQuery<T>(
  queryKey: string | readonly string[],
  endpoint: string,
  limit: number = 20
) {
  const [page, setPage] = useState(1);

  const baseKey = typeof queryKey === "string" ? [queryKey] : queryKey;

  const query = useQuery<Paginated<T>>({
    queryKey: [...baseKey, page],
    queryFn: async () => {
      const res = await api.get<Paginated<T>>(endpoint, { params: { page, limit } });
      return res.data;
    },
  });

  return {
    ...query,
    page,
    setPage,
    nextPage:    () => setPage((p) => p + 1),
    prevPage:    () => setPage((p) => Math.max(1, p - 1)),
    hasNextPage: (query.data?.pages ?? 0) > page,
    hasPrevPage: page > 1,
  };
}
