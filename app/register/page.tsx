"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/lib/schemas";
import { z } from "zod";
import { api, getApiError } from "@/lib/api";
import { setToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { UserPlus, Mail, Lock, User, Loader2, AlertCircle, ArrowLeft } from "lucide-react";

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Register the user
      await api.post("/auth/register", data);

      // 2. Automatically login after registration
      const loginData = new URLSearchParams();
      loginData.append("username", data.email);
      loginData.append("password", data.password);

      const loginResponse = await api.post("/auth/login", loginData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      setToken(loginResponse.data.access_token);
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
          <div className="mb-8 text-center relative">
            <a 
              href="/login" 
              className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </a>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Dołącz do HustleOS</h1>
            <p className="text-gray-400">Zacznij budować swoją przyszłość już dziś</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300 ml-1">Imię i nazwisko</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-4 flex items-center text-gray-500 group-focus-within/input:text-blue-500 transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <input
                  {...register("full_name")}
                  placeholder="Jan Kowalski"
                  className="w-full bg-[#1c1c21] border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                />
              </div>
              {errors.full_name && (
                <p className="text-red-500 text-xs ml-1">{errors.full_name.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300 ml-1">Email</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-4 flex items-center text-gray-500 group-focus-within/input:text-blue-500 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="twoj@email.com"
                  className="w-full bg-[#1c1c21] border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs ml-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
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
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Utwórz konto
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Masz już konto?{" "}
            <a href="/login" className="text-blue-500 hover:text-blue-400 transition-colors font-medium">
              Zaloguj się
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
