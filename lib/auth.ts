import { api } from "@/lib/api";

export async function logout() {
  await api.post("/auth/logout");
}
