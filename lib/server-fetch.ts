import { cookies } from "next/headers";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function fetchWithAuth<T>(path: string): Promise<T | null> {
  const token = (await cookies()).get("frontend_token")?.value;
  if (!token) return null;

  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 0 },
  });

  if (!res.ok) return null;
  return res.json() as Promise<T>;
}
