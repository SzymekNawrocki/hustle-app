"use client";

import { usePaginatedQuery } from "./use-paginated-query";
import { useCRUD } from "./use-crud";
import type { JobOffer } from "@/types/api";

export function useJobOffers() {
  const query = usePaginatedQuery<JobOffer>("offers", "/offers", 20);
  const { remove, update, create } = useCRUD<JobOffer>("/offers", "offers");

  return {
    ...query,
    offers: query.data?.items ?? [],
    remove,
    update,
    create,
  };
}
