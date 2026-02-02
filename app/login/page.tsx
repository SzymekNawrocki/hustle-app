"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/schemas";
import { z } from "zod";
import { api, getApiError } from "@/lib/api";
import { setToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { LogIn, Mail, Lock, Loader2, AlertCircle } from "lucide-react";

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      // OAuth2 expects form data
      const formData = new URLSearchParams();
      formData.append("username", data.username);
      formData.append("password", data.password);

      const response = await api.post("/auth/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      setToken(response.data.access_token);
      router.push("/dashboard");
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent)] pointer-events-none" />
      
      <div className="w-full max-w-md relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
        
        <div className="relative bg-[#111114] border border-white/10 rounded-2xl p-8 shadow-2xl overflow-hidden">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">HustleOS</h1>
            <p className="text-gray-400">Przejmij kontrolę nad swoją produktywnością</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Email</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-4 flex items-center text-gray-500 group-focus-within/input:text-blue-500 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  {...register("username")}
                  type="email"
                  placeholder="twoj@email.com"
                  className="w-full bg-[#1c1c21] border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-xs ml-1">{errors.username.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Hasło</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-4 flex items-center text-gray-500 group-focus-within/input:text-blue-500 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  {...register("password")}
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-[#1c1c21] border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs ml-1">{errors.password.message}</p>
              )}
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Zaloguj się
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Nie masz konta?{" "}
            <a href="#" className="text-blue-500 hover:text-blue-400 transition-colors font-medium">
              Zarejestruj się
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
