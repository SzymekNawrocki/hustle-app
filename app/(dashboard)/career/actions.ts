"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { JobOffer, OfferStatus } from "@/types/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

function getApiBase(): string {
  if (!API_BASE) {
    throw new Error("NEXT_PUBLIC_API_URL is not set");
  }
  return API_BASE;
}

async function getAuthHeader(): Promise<Record<string, string>> {
  const token = (await cookies()).get("token")?.value;
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export async function getOffers() {
  const res = await fetch(`${getApiBase()}/offers`, {
    headers: {
      ...(await getAuthHeader()),
    },
    cache: "no-store",
  });

  if (res.status === 401) {
    (await cookies()).delete("token");
    redirect("/login");
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Failed to fetch offers (${res.status})`);
  }

  return (await res.json()) as JobOffer[];
}

export async function createOffer(input: { title: string; company?: string; status: OfferStatus; url: string }) {
  const res = await fetch(`${getApiBase()}/offers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(await getAuthHeader()),
    },
    body: JSON.stringify(input),
  });

  if (res.status === 401) {
    (await cookies()).delete("token");
    redirect("/login");
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Failed to create offer (${res.status})`);
  }

  revalidatePath("/career");
}

export async function updateOfferStatus(offerId: number, formData: FormData) {
  const status = formData.get("status");
  if (typeof status !== "string") {
    throw new Error("Invalid status");
  }

  const res = await fetch(`${getApiBase()}/offers/${offerId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(await getAuthHeader()),
    },
    body: JSON.stringify({ status }),
  });

  if (res.status === 401) {
    (await cookies()).delete("token");
    redirect("/login");
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Failed to update offer (${res.status})`);
  }

  revalidatePath("/career");
}

export async function deleteOffer(offerId: number) {
  const res = await fetch(`${getApiBase()}/offers/${offerId}`, {
    method: "DELETE",
    headers: {
      ...(await getAuthHeader()),
    },
  });

  if (res.status === 401) {
    (await cookies()).delete("token");
    redirect("/login");
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Failed to delete offer (${res.status})`);
  }

  revalidatePath("/career");
}
