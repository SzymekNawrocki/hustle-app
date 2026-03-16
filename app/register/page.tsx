"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/lib/schemas";
import { z } from "zod";
import { api, getApiError } from "@/lib/api";
import { setToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { UserPlus, Mail, Lock, User, Loader2, AlertCircle, ArrowLeft, ArrowRight } from "lucide-react";

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
      await api.post("/auth/register", data);

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
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4 selection:bg-primary selection:text-primary-content font-sans">
      <div className="fixed inset-0 bg-[#0D0D0D] -z-20" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[150px] rounded-full -z-10 animate-pulse" />
      
      <div className="w-full max-w-md relative animate-in fade-in zoom-in duration-500">
        <div className="card bg-base-200/50 backdrop-blur-xl border border-white/5 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <div className="h-1.5 bg-gradient-to-r from-primary via-secondary to-primary animate-gradient bg-[length:200%_auto]" />

          <div className="card-body p-8 lg:p-10 space-y-8">
            <div className="text-center space-y-4">
              <div className="flex flex-col items-center justify-center gap-4 mb-2">
                <div className="p-3 bg-primary rounded-2xl shadow-[0_0_30px_rgba(123,46,255,0.5)]">
                  <UserPlus className="w-8 h-8 text-primary-content" />
                </div>
                <h1 className="text-4xl font-display text-primary tracking-tight">HustleOS</h1>
              </div>
              <div>
                <h2 className="text-xl font-display text-base-content tracking-tight">Stwórz konto</h2>
                <p className="text-base-content/60 font-display text-[9px] mt-2 leading-relaxed tracking-wider">Dołącz do społeczności sukcesu</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="alert alert-error rounded-xl border-none text-[9px] font-display py-3 tracking-wider">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="form-control">
                <label className="label">
                  <span className="label-text-alt font-display opacity-40 tracking-wider">Imię i nazwisko</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center text-primary/40 group-focus-within:text-primary transition-colors">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    {...register("full_name")}
                    type="text"
                    placeholder="Jan Kowalski"
                    className="input input-bordered w-full bg-base-100/50 border-white/10 pl-12 focus:input-primary transition-all py-6"
                  />
                </div>
                {errors.full_name && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.full_name.message}</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text-alt font-display opacity-40 tracking-wider">Adres Email</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center text-primary/40 group-focus-within:text-primary transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="twoj@email.com"
                    className="input input-bordered w-full bg-base-100/50 border-white/10 pl-12 focus:input-primary transition-all py-6"
                  />
                </div>
                {errors.email && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.email.message}</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text-alt font-display opacity-40 tracking-wider">Hasło</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center text-primary/40 group-focus-within:text-primary transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    {...register("password")}
                    type="password"
                    placeholder="••••••••"
                    className="input input-bordered w-full bg-base-100/50 border-white/10 pl-12 focus:input-primary transition-all py-6"
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
                    Zarejestruj się <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="space-y-6">
              <div className="divider opacity-10 font-display text-[9px]">LUB</div>
              
              <div className="text-center">
                <p className="text-sm opacity-60">
                  Masz już konto?{" "}
                  <a href="/login" university-href="/login" className="text-primary font-display text-xs hover:opacity-70 transition-opacity">
                    Zaloguj się
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
