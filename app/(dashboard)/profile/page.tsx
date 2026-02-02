"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api, getApiError } from "@/lib/api";
import { UserProfile, UserProfileUpdate } from "@/types/api";
import { 
  User, 
  FileText, 
  Save, 
  Loader2, 
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function ProfilePage() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: profile, isLoading } = useQuery<UserProfile>({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await api.get("/career/profile");
      return response.data;
    },
  });

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: async (data: UserProfileUpdate) => {
      const response = await api.put("/career/profile", data);
      return response.data;
    },
    onSuccess: () => {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setError(null);
    },
    onError: (err) => {
      setError(getApiError(err));
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: UserProfileUpdate = {
      full_name: formData.get("full_name") as string,
      job_title: formData.get("job_title") as string,
      cv_text: formData.get("cv_text") as string,
    };
    updateProfile(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Twój Profil</h1>
        <p className="text-gray-400 mt-2">Dostosuj swoje dane dla lepszej analizy AI.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-[#111114] border border-white/5 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Imię i Nazwisko</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center text-gray-500">
                  <User className="w-5 h-5" />
                </div>
                <input
                  name="full_name"
                  defaultValue={profile?.full_name || ""}
                  className="w-full bg-[#1c1c21] border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                  placeholder="Jan Kowalski"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Aktualne Stanowisko</label>
              <div className="relative">
                <input
                  name="job_title"
                  defaultValue={profile?.job_title || ""}
                  className="w-full bg-[#1c1c21] border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                  placeholder="Software Engineer"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Twoje CV (Tekst)
            </label>
            <textarea
              name="cv_text"
              defaultValue={profile?.cv_text || ""}
              className="w-full bg-[#1c1c21] border border-white/5 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all min-h-[300px] text-sm leading-relaxed resize-none"
              placeholder="Wklej tutaj tekst swojego CV..."
            />
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold px-1">
              AI użyje tego tekstu do porównywania Twoich umiejętności z ofertami pracy.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-2 text-green-500 text-sm font-medium transition-opacity duration-500 ${success ? "opacity-100" : "opacity-0"}`}>
            <CheckCircle className="w-4 h-4" />
            Zmiany zostały zapisane!
          </div>
          
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Zapisz profil
          </button>
        </div>
      </form>
    </div>
  );
}
