"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Lock, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api, getApiError } from "@/lib/api";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await api.post("/auth/reset-password", { token, new_password: newPassword });
      setIsDone(true);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <Alert variant="destructive" className="rounded-xl border-none text-xs font-display py-3 tracking-wide">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <AlertDescription className="text-xs font-display tracking-wide">
          Invalid reset link. Please request a new one.
        </AlertDescription>
      </Alert>
    );
  }

  return isDone ? (
    <div className="text-center space-y-6 py-4">
      <div className="flex justify-center">
        <div className="p-5 rounded-full bg-success/10 text-success border border-success/20 shadow-inner">
          <CheckCircle2 className="w-12 h-12" />
        </div>
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-display text-foreground tracking-tight">Password updated</h2>
        <p className="text-muted-foreground leading-relaxed font-sans">
          Your password has been reset successfully.
        </p>
      </div>
      <Button asChild className="w-full font-display tracking-wide h-12">
        <a href="/login">Sign in</a>
      </Button>
    </div>
  ) : (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive" className="rounded-xl border-none text-xs font-display py-3 tracking-wide">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <AlertDescription className="text-xs font-display tracking-wide">{error}</AlertDescription>
        </Alert>
      )}

      <div className="form-control">
        <label className="label">
          <span className="label-text-alt font-display opacity-40 tracking-wider">New password</span>
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center text-primary/40">
            <Lock className="w-5 h-5" />
          </div>
          <Input
            required
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-background/40 border-border/60 pl-12 pr-12 py-6 h-12 rounded-2xl"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-4 flex items-center text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text-alt font-display opacity-40 tracking-wider">Confirm password</span>
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center text-primary/40">
            <Lock className="w-5 h-5" />
          </div>
          <Input
            required
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-background/40 border-border/60 pl-12 py-6 h-12 rounded-2xl"
          />
        </div>
      </div>

      <Button
        disabled={isLoading}
        type="submit"
        className="w-full gap-3 font-display text-lg tracking-wide h-12 mt-4 shadow-[0_0_20px_rgba(123,46,255,0.2)]"
      >
        {isLoading ? (
          <span className="h-4 w-4 rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground animate-spin" />
        ) : (
          "Set new password"
        )}
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 selection:bg-primary selection:text-primary-foreground font-sans">
      <div className="fixed inset-0 bg-[#0D0D0D] -z-20" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[150px] rounded-full -z-10 animate-pulse" />

      <div className="w-full max-w-md relative">
        <Card className="bg-card/60 backdrop-blur-xl border border-border/60 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.6)]">
          <CardContent className="p-8 lg:p-10 space-y-8">
            <div className="text-center space-y-4">
              <div className="flex flex-col items-center justify-center gap-4 mb-2">
                <div className="p-3 bg-primary rounded-2xl shadow-[0_0_30px_rgba(123,46,255,0.5)]">
                  <Lock className="w-8 h-8 text-primary-content" />
                </div>
                <h1 className="text-4xl font-display text-primary tracking-tight">Hustle App</h1>
              </div>
              <div>
                <h2 className="text-xl font-display text-foreground tracking-tight">Set new password</h2>
                <p className="text-muted-foreground font-display text-xs mt-2 leading-relaxed tracking-wide">Choose a strong password</p>
              </div>
            </div>

            <Suspense fallback={<div className="h-40 flex items-center justify-center text-muted-foreground text-sm">Loading…</div>}>
              <ResetPasswordForm />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
