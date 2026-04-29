import { api } from "@/lib/api";

export async function logout() {
  await api.post("/auth/logout");
  await fetch("/api/auth/session", { method: "DELETE" });
}
