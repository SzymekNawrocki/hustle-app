"use client";

import { useState } from "react";
import { Mail, Lock as LockIcon, AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";

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
      setError("Wystąpił błąd. Spróbuj ponownie później.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4 selection:bg-primary selection:text-primary-content">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>
      
      <div className="w-full max-w-md relative animate-in fade-in zoom-in duration-500">
        <div className="card bg-base-200 border border-base-300 shadow-2xl overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-shimmer" />

          <div className="card-body p-8 lg:p-10 space-y-8">
            <div className="text-center relative space-y-4">
              <a 
                href="/login" 
                className="btn btn-ghost btn-sm btn-square absolute left-0 top-0 text-base-content/40 hover:text-primary transition-colors"
                aria-label="Powrót"
              >
                <ArrowLeft className="w-5 h-5" />
              </a>
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="p-2 bg-primary rounded-lg shadow-lg">
                  <LockIcon className="w-6 h-6 text-primary-content" />
                </div>
                <h1 className="text-3xl font-bold text-primary">HustleOS</h1>
              </div>
              <div>
                <h2 className="text-xl font-bold text-base-content">Zresetuj hasło</h2>
                <p className="text-base-content/60 font-medium text-xs mt-2 leading-relaxed">Bezpieczeństwo przede wszystkim</p>
              </div>
            </div>

            {!isSent ? (
              <form onSubmit={onSubmit} className="space-y-6">
                {error && (
                  <div className="alert alert-error shadow-lg rounded-xl border-none text-xs font-bold py-3">
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
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="twoj@email.com"
                      className="input input-bordered w-full bg-base-100 pl-12 focus:input-primary transition-all font-medium"
                    />
                  </div>
                </div>

                <button
                  disabled={isLoading}
                  type="submit"
                  className="btn btn-primary btn-block btn-lg shadow-xl shadow-primary/20 gap-3 font-bold normal-case h-14 mt-4"
                >
                  {isLoading ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    "WYŚLIJ INSTRUKCJE"
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center space-y-6 py-4 animate-in fade-in duration-500">
                <div className="flex justify-center">
                  <div className="p-5 rounded-full bg-success/10 text-success border border-success/20 shadow-inner">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-base-content tracking-tight">Sprawdź skrzynkę</h2>
                  <p className="text-base-content/60 font-medium leading-relaxed">
                    Instrukcje resetowania hasła zostały wysłane na:<br />
                    <span className="text-base-content font-bold underline decoration-primary underline-offset-4">{email}</span>
                  </p>
                </div>
                <div className="pt-4">
                  <a 
                    href="/login" 
                    className="btn btn-ghost font-bold text-xs hover:text-primary transition-colors"
                  >
                    Powrót do logowania
                  </a>
                </div>
              </div>
            )}

            {!isSent && (
              <p className="mt-8 text-center text-sm font-medium opacity-60">
                Pamiętasz hasło?{" "}
                <a href="/login" className="text-primary font-bold text-xs hover:opacity-70 transition-opacity">
                  Zaloguj się
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
