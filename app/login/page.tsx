"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/schemas";
import { z } from "zod";
import { api, getApiError } from "@/lib/api";
import { setToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { LogIn, Mail, Lock, Loader2, AlertCircle, ArrowRight, Stars } from "lucide-react";

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

  const handleDemoLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/demo-login");
      setToken(response.data.access_token);
      router.push("/dashboard");
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4 selection:bg-primary selection:text-primary-content">
      <div className="fixed inset-0 bg-[#0D0D0D] -z-20" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[150px] rounded-full -z-10 animate-pulse" />
      
      <div className="w-full max-w-md relative animate-in fade-in zoom-in duration-500">
        <div className="card bg-base-200/50 backdrop-blur-xl border border-white/5 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <div className="h-1.5 bg-gradient-to-r from-primary via-secondary to-primary animate-gradient bg-[length:200%_auto]" />

          <div className="card-body p-8 lg:p-10 space-y-8">
            <div className="text-center space-y-4">
              <div className="flex flex-col items-center justify-center gap-4 mb-2">
                <div className="p-3 bg-primary rounded-2xl shadow-[0_0_30px_rgba(123,46,255,0.5)]">
                  <LogIn className="w-8 h-8 text-primary-content" />
                </div>
                <h1 className="text-4xl font-display text-primary tracking-tight">HustleOS</h1>
              </div>
              <div>
                <h2 className="text-xl font-display text-base-content tracking-tight">Witaj ponownie</h2>
                <p className="text-base-content/60 font-display text-[9px] mt-2 leading-relaxed tracking-wider">System sukcesu czeka na Ciebie</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 font-sans">
              {error && (
                <div className="alert alert-error rounded-xl border-none text-[9px] font-display py-3 tracking-wider">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="form-control">
                <label className="label">
                  <span className="label-text-alt font-display opacity-40 tracking-wider">Adres Email</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center text-primary/40 group-focus-within:text-primary transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    {...register("username")}
                    type="email"
                    placeholder="twoj@email.com"
                    className="input input-bordered w-full bg-base-100/50 border-white/5 pl-12 focus:input-primary transition-all py-6"
                  />
                </div>
                {errors.username && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.username.message}</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <div className="flex justify-between items-end mb-1">
                  <label className="label p-0">
                    <span className="label-text-alt font-display opacity-40 tracking-wider">Hasło</span>
                  </label>
                  <a href="/forgot-password" university-href="/forgot-password" className="text-[9px] font-display text-primary hover:opacity-70 transition-opacity tracking-wider">
                    Zapomniałeś?
                  </a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center text-primary/40 group-focus-within:text-primary transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    {...register("password")}
                    type="password"
                    placeholder="••••••••"
                    className="input input-bordered w-full bg-base-100/50 border-white/5 pl-12 focus:input-primary transition-all py-6"
                  />
                </div>
                {errors.password && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.password.message}</span>
                  </label>
                )}
              </div>

              <button
                disabled={isLoading}
                type="submit"
                className="btn btn-primary btn-block btn-lg gap-3 font-display text-lg tracking-wide h-12 mt-4 shadow-[0_0_20px_rgba(123,46,255,0.2)] transition-all hover:scale-[1.01]"
              >
                {isLoading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  <>
                    Zaloguj się <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <button
                disabled={isLoading}
                onClick={handleDemoLogin}
                type="button"
                className="btn btn-outline btn-block btn-lg gap-3 font-display text-sm tracking-wide h-12 border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-all"
              >
                <Stars className="w-4 h-4 text-primary" />
                Wypróbuj Demo
              </button>
            </form>

            <div className="space-y-6">
              <div className="divider opacity-10 text-[10px]">LUB</div>
              
              <div className="text-center">
                <p className="text-sm opacity-60">
                  Nie masz jeszcze konta?{" "}
                  <a href="/register" className="text-primary text-xs hover:opacity-70 transition-opacity">
                    Zarejestruj się
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
