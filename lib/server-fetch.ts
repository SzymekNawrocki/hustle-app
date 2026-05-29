import { cookies } from "next/headers";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export type FetchResult<T> =
  | { ok: true; data: T }
  | { ok: false; reason: "unauthenticated" | "api-error"; status?: number };

export async function fetchWithAuth<T>(path: string): Promise<FetchResult<T>> {
  const token = (await cookies()).get("frontend_token")?.value;
  if (!token) return { ok: false, reason: "unauthenticated" };

  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 0 },
  });

  if (!res.ok) return { ok: false, reason: "api-error", status: res.status };

  const data = (await res.json()) as T;
  return { ok: true, data };
}
