"use client";

import { useEffect, useState } from "react";
import { getToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    setIsAuthenticated(!!token);
  }, []);

  const checkAuth = () => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return false;
    }
    return true;
  };

  return { isAuthenticated, checkAuth };
}
