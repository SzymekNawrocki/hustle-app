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
        <span className="loading loading-ring loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in duration-700 text-left">
      <div>
        <h1 className="text-4xl font-bold text-base-content tracking-tight">Twój Profil</h1>
        <p className="text-base-content/60 mt-2 font-medium">Dostosuj swoje dane dla lepszej analizy AI.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="card bg-base-200 border border-base-300 shadow-xl overflow-hidden">
          <div className="card-body p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="form-control">
                <label className="label">
                  <span className="label-text-alt font-bold opacity-40">Imię i Nazwisko</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center text-primary/50">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    name="full_name"
                    defaultValue={profile?.full_name || ""}
                    className="input input-bordered w-full bg-base-100 pl-12 focus:input-primary transition-all font-bold"
                    placeholder="Jan Kowalski"
                  />
                </div>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text-alt font-bold opacity-40">Aktualne Stanowisko</span>
                </label>
                <input
                  name="job_title"
                  defaultValue={profile?.job_title || ""}
                  className="input input-bordered w-full bg-base-100 focus:input-primary transition-all font-bold"
                  placeholder="Software Engineer"
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text-alt font-bold opacity-40 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Twoje CV (Tekst)
                </span>
              </label>
              <textarea
                name="cv_text"
                defaultValue={profile?.cv_text || ""}
                className="textarea textarea-bordered bg-base-100 focus:textarea-primary transition-all min-h-[350px] text-base leading-relaxed resize-none shadow-inner"
                placeholder="Wklej tutaj tekst swojego CV..."
              />
              <label className="label">
                <span className="label-text-alt text-[10px] opacity-40 font-bold mt-2 px-1">
                  AI użyje tego tekstu do porównywania Twoich umiejętności z ofertami pracy.
                </span>
              </label>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-error shadow-xl rounded-2xl border-none">
            <AlertCircle className="w-6 h-6" />
            <span className="font-bold">{error}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className={`flex items-center gap-3 text-success font-bold transition-all duration-500 bg-success/10 px-4 py-3 rounded-xl border border-success/20 ${success ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <CheckCircle className="w-4 h-4" />
            Zmiany zapisane!
          </div>
          
          <button
            type="submit"
            disabled={isPending}
            className="btn btn-primary btn-lg px-12 shadow-xl gap-3 font-bold h-16 w-full sm:w-auto"
          >
            {isPending ? <span className="loading loading-spinner"></span> : <Save className="w-6 h-6" />}
            Zapisz profil
          </button>
        </div>
      </form>
    </div>
  );
}
