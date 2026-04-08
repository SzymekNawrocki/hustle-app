"use client";

import { useState } from "react";
import { Mail, Lock as LockIcon, AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Mocking the request for now as the backend doesn't support email sending yet
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSent(true);
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4 selection:bg-primary selection:text-primary-content font-sans">
      <div className="fixed inset-0 bg-[#0D0D0D] -z-20" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[150px] rounded-full -z-10 animate-pulse" />
      
      <div className="w-full max-w-md relative animate-in fade-in zoom-in duration-500">
        <Card className="bg-base-200/50 backdrop-blur-xl border border-white/5 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <CardContent className="p-8 lg:p-10 space-y-8">
            <div className="text-center relative space-y-4">
              <Button
                variant="ghost"
                size="icon-sm"
                asChild
                className="absolute left-0 top-0 text-base-content/40 hover:text-primary transition-colors"
              >
                <a href="/login" university-href="/login" aria-label="Back">
                  <ArrowLeft className="w-5 h-5" />
                </a>
              </Button>
              <div className="flex flex-col items-center justify-center gap-4 mb-2">
                <div className="p-3 bg-primary rounded-2xl shadow-[0_0_30px_rgba(123,46,255,0.5)]">
                  <LockIcon className="w-8 h-8 text-primary-content" />
                </div>
                <h1 className="text-4xl font-display text-primary tracking-tight">HustleOS</h1>
              </div>
              <div>
                <h2 className="text-xl font-display text-base-content tracking-tight">Reset password</h2>
                <p className="text-base-content/60 font-display text-xs mt-2 leading-relaxed tracking-wide">Security first</p>
              </div>
            </div>

            {!isSent ? (
              <form onSubmit={onSubmit} className="space-y-6">
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
                    <div className="absolute inset-y-0 left-4 flex items-center text-primary/40 group-focus-within:text-primary transition-colors">
                      <Mail className="w-5 h-5" />
                    </div>
                    <Input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-base-100/50 border-white/5 pl-12 transition-all py-6 h-12 rounded-2xl"
                    />
                  </div>
                </div>

                <Button
                  disabled={isLoading}
                  type="submit"
                  className="w-full gap-3 font-display text-lg tracking-wide h-12 mt-4 shadow-[0_0_20px_rgba(123,46,255,0.2)] transition-all hover:scale-[1.01]"
                >
                  {isLoading ? (
                    <span className="h-4 w-4 rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground animate-spin" />
                  ) : (
                    "Send instructions"
                  )}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-6 py-4 animate-in fade-in duration-500">
                <div className="flex justify-center">
                  <div className="p-5 rounded-full bg-success/10 text-success border border-success/20 shadow-inner">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-display text-base-content tracking-tight">Check your inbox</h2>
                  <p className="text-base-content/60 leading-relaxed font-sans">
                    Password reset instructions were sent to:<br />
                    <span className="text-base-content underline decoration-primary underline-offset-4">{email}</span>
                  </p>
                </div>
                <div className="pt-4">
                  <Button
                    variant="ghost"
                    asChild
                    className="font-display text-xs hover:text-primary transition-colors tracking-wide"
                  >
                    <a href="/login" university-href="/login">Back to sign in</a>
                  </Button>
                </div>
              </div>
            )}

            {!isSent && (
              <p className="mt-8 text-center text-sm opacity-60">
                Remember your password?{" "}
                <a href="/login" university-href="/login" className="text-primary font-display text-xs hover:opacity-70 transition-opacity tracking-wide">
                  Sign in
                </a>
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
