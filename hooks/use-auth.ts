"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        await api.get("/auth/me");
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      }
    })();
  }, []);

  const checkAuth = () => {
    return true;
  };

  return { isAuthenticated, checkAuth };
}
