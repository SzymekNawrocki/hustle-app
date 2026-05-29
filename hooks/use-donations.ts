"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface CreateCheckoutRequest {
  amount_cents: number;
  supporter_name?: string;
}

interface CheckoutResponse {
  checkout_url: string;
}

export interface Donation {
  id: number;
  amount_cents: number;
  currency: string;
  supporter_name: string | null;
  status: string;
  created_at: string;
}

export function useDonations() {
  const recentDonations = useQuery<Donation[]>({
    queryKey: ["recent-donations"],
    queryFn: async () => {
      const res = await api.get<Donation[]>("/donations/recent");
      return res.data;
    },
    staleTime: 30_000,
  });

  const createCheckout = useMutation({
    mutationFn: async (data: CreateCheckoutRequest) => {
      const res = await api.post<CheckoutResponse>("/donations/checkout-session", data);
      return res.data;
    },
    onSuccess: (data) => {
      window.location.href = data.checkout_url;
    },
  });

  return { recentDonations, createCheckout };
}
