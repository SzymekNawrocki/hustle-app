"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/schemas";
import { z } from "zod";
import { api, getApiError } from "@/lib/api";
import { LogIn, Mail, Lock, AlertCircle, ArrowRight, Stars } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
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

      console.log("Attempting login for:", data.username);
      const response = await api.post("/auth/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      console.log("Login successful, redirecting to dashboard...");
      void response;
      window.location.href = "/dashboard";
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
      console.log("Attempting demo login...");
      const response = await api.post("/auth/demo-login");
      console.log("Demo login successful, redirecting...");
      void response;
      window.location.href = "/dashboard";
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 selection:bg-primary selection:text-primary-foreground">
      <div className="fixed inset-0 bg-[#0D0D0D] -z-20" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[150px] rounded-full -z-10 animate-pulse" />
      
      <div className="w-full max-w-md relative">
        <Card className="bg-card/60 backdrop-blur-xl border border-border/60 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.6)]">
          <CardContent className="p-8 lg:p-10 space-y-8">
            <div className="text-center space-y-4">
              <div className="flex flex-col items-center justify-center gap-4 mb-2">
                <div className="p-3 bg-primary rounded-2xl shadow-[0_0_30px_rgba(123,46,255,0.5)]">
                  <LogIn className="w-8 h-8 text-primary-content" />
                </div>
                <h1 className="text-4xl font-display text-primary tracking-tight">Hustle App</h1>
              </div>
              <div>
                <h2 className="text-xl font-display text-foreground tracking-tight">Welcome back</h2>
                <p className="text-muted-foreground font-display text-xs mt-2 leading-relaxed tracking-wide">Your success system is waiting</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 font-sans">
              {error && (
                <Alert variant="destructive" className="rounded-xl border-none text-xs font-display py-3 tracking-wide">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <AlertDescription className="text-xs font-display tracking-wide">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="form-control">
                <label className="label">
                  <span className="label-text-alt font-display opacity-40 tracking-wider">Email</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center text-primary/40">
                    <Mail className="w-5 h-5" />
                  </div>
                  <Input
                    {...register("username")}
                    type="email"
                    placeholder="you@example.com"
                    className="w-full bg-background/40 border-border/60 pl-12 py-6 h-12 rounded-2xl"
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
                    <span className="label-text-alt font-display opacity-40 tracking-wider">Password</span>
                  </label>
                  <a href="/forgot-password" university-href="/forgot-password" className="text-xs font-display text-primary tracking-wide">
                    Forgot?
                  </a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center text-primary/40">
                    <Lock className="w-5 h-5" />
                  </div>
                  <Input
                    {...register("password")}
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-background/40 border-border/60 pl-12 py-6 h-12 rounded-2xl"
                  />
                </div>
                {errors.password && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.password.message}</span>
                  </label>
                )}
              </div>

              <Button
                disabled={isLoading}
                type="submit"
                className="w-full gap-3 font-display text-lg tracking-wide h-12 mt-4 shadow-[0_0_20px_rgba(123,46,255,0.2)]"
              >
                {isLoading ? (
                  <span className="h-4 w-4 rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground animate-spin" />
                ) : (
                  <>
                    Sign in <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>

              <Button
                disabled={isLoading}
                onClick={handleDemoLogin}
                type="button"
                variant="outline"
                className="w-full gap-3 font-display text-sm tracking-wide h-12 border-primary/20"
              >
                <Stars className="w-4 h-4 text-primary" />
                Try Demo
              </Button>
            </form>

            <div className="space-y-6">
              <div className="flex items-center gap-4 opacity-40">
                <Separator className="flex-1" />
                <span className="text-xs font-display">OR</span>
                <Separator className="flex-1" />
              </div>
              
              <div className="text-center">
                <p className="text-sm opacity-60">
                  Don&apos;t have an account?{" "}
                  <a href="/register" className="text-primary text-xs">
                    Sign up
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
