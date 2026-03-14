"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/schemas";
import { z } from "zod";
import { api, getApiError } from "@/lib/api";
import { setToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { LogIn, Mail, Lock, Loader2, AlertCircle, ArrowRight } from "lucide-react";

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
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4 selection:bg-primary selection:text-primary-content">
      {/* Background decorations removed */}

      
      <div className="w-full max-w-md relative animate-in fade-in zoom-in duration-500">
        <div className="card bg-base-200 border border-base-300 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto]" />

          <div className="card-body p-8 lg:p-10 space-y-8">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="p-2 bg-primary rounded-lg">
                  <LogIn className="w-6 h-6 text-primary-content" />
                </div>
                <h1 className="text-3xl font-bold text-primary">HustleOS</h1>
              </div>
              <div>
                <h2 className="text-xl font-bold text-base-content">Witaj ponownie</h2>
                <p className="text-base-content/60 font-medium text-xs mt-2 leading-relaxed">System sukcesu czeka na Ciebie</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="alert alert-error rounded-xl border-none text-xs font-bold py-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="form-control">
                <label className="label">
                  <span className="label-text-alt font-semibold opacity-40">Adres Email</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center text-primary/40 group-focus-within:text-primary transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    {...register("username")}
                    type="email"
                    placeholder="twoj@email.com"
                    className="input input-bordered w-full bg-base-100 pl-12 focus:input-primary transition-all font-medium"
                  />
                </div>
                {errors.username && (
                  <label className="label">
                    <span className="label-text-alt text-error font-medium">{errors.username.message}</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <div className="flex justify-between items-end mb-1">
                  <label className="label p-0">
                    <span className="label-text-alt font-semibold opacity-40">Hasło</span>
                  </label>
                  <a href="/forgot-password" className="text-[10px] font-semibold text-primary hover:opacity-70 transition-opacity">
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
                    className="input input-bordered w-full bg-base-100 pl-12 focus:input-primary transition-all font-medium"
                  />
                </div>
                {errors.password && (
                  <label className="label">
                    <span className="label-text-alt text-error font-medium">{errors.password.message}</span>
                  </label>
                )}
              </div>

              <button
                disabled={isLoading}
                type="submit"
                className="btn btn-primary btn-block btn-lg gap-3 font-bold normal-case h-14 mt-4"
              >
                {isLoading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  <>
                    ZALOGUJ SIĘ <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="space-y-6">
              <div className="divider opacity-10 font-semibold text-[10px]">LUB</div>
              
              <div className="text-center">
                <p className="text-sm font-medium opacity-60">
                  Nie masz jeszcze konta?{" "}
                  <a href="/register" className="text-primary font-bold text-xs hover:opacity-70 transition-opacity">
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
