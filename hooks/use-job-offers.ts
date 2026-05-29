"use client";

import { usePaginatedQuery } from "./use-paginated-query";
import { useCRUD } from "./use-crud";
import type { JobOffer } from "@/types/api";
import { KEYS } from "@/lib/query-options";

export function useJobOffers() {
  const query = usePaginatedQuery<JobOffer>(KEYS.offers, "/offers", 20);
  const { remove, update, create } = useCRUD<JobOffer>("/offers", KEYS.offers);

  return {
    ...query,
    offers: query.data?.items ?? [],
    remove,
    update,
    create,
  };
}
