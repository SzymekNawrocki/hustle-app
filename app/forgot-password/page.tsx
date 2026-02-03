"use client";

import { useState } from "react";
import { Mail, Loader2, AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";

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
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Zresetuj hasło</h1>
            <p className="text-gray-400">Wyślemy Ci instrukcje na podany adres e-mail</p>
          </div>

          {!isSent ? (
            <form onSubmit={onSubmit} className="space-y-6">
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
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="twoj@email.com"
                    className="w-full bg-[#1c1c21] border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <button
                disabled={isLoading}
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Wyślij instrukcje"
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-4">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-green-500/10 text-green-500">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Sprawdź skrzynkę</h2>
              <p className="text-gray-400 mb-6">Instrukcje resetowania hasła zostały wysłane na <strong>{email}</strong>.</p>
              <a 
                href="/login" 
                className="text-blue-500 hover:text-blue-400 transition-colors font-medium"
              >
                Powrót do logowania
              </a>
            </div>
          )}

          <div className="mt-8 text-center text-sm text-gray-500">
            Pamiętasz hasło?{" "}
            <a href="/login" className="text-blue-500 hover:text-blue-400 transition-colors font-medium">
              Zaloguj się
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
