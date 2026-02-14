"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { JobApplication, CareerAnalysisResponse } from "@/types/api";
import { 
  Plus, 
  Search, 
  Sparkles, 
  Loader2, 
  Briefcase, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2
} from "lucide-react";

export default function CareerPage() {
  const queryClient = useQueryClient();
  const [description, setDescription] = useState("");
  const [analysis, setAnalysis] = useState<CareerAnalysisResponse | null>(null);

  const { data: applications, isLoading } = useQuery<JobApplication[]>({
    queryKey: ["applications"],
    queryFn: async () => {
      const response = await api.get("/career/applications");
      return response.data;
    },
  });

  const { mutate: analyze, isPending: isAnalyzing } = useMutation({
    mutationFn: async (desc: string) => {
      const response = await api.post("/career/analyze", { description: desc });
      return response.data;
    },
    onSuccess: (data) => {
      setAnalysis(data);
    },
  });

  const getScoreBadgeClass = (score: number) => {
    if (score < 50) return "badge-error";
    if (score < 75) return "badge-warning";
    return "badge-success";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="loading loading-ring loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-bold text-base-content tracking-tight">Kariera</h1>
          <p className="text-base-content/60 mt-2 font-medium leading-relaxed max-w-2xl">
            Przeanalizuj oferty pracy i dopasuj swoje umiejętności dzięki potędze Groq AI.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-base-200/50 p-3 rounded-2xl border border-base-300">
           <div className="p-2 bg-primary/20 rounded-lg">
             <Briefcase className="w-5 h-5 text-primary" />
           </div>
           <span className="text-sm font-bold opacity-70">12 Aktywnych aplikacji</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="card bg-base-200 border border-base-300 shadow-xl overflow-hidden">
          <div className="card-body p-0">
            <div className="p-6 border-b border-base-300 flex items-center justify-between bg-base-200/30">
              <h2 className="card-title text-xl font-bold text-base-content">Najnowsze analizy</h2>
              <div className="flex items-center gap-2">
                <button className="btn btn-ghost btn-sm font-bold">Filtruj</button>
                <div className="divider divider-horizontal mx-0" />
                <button className="btn btn-primary btn-sm px-6 font-bold">Nowa analiza</button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr className="bg-base-300/30 text-base-content/70 tracking-wide text-xs">
                    <td className="font-bold py-6 pl-8">Firma / Stanowisko</td>
                    <td className="font-bold py-6">Dopasowanie AI</td>
                    <td className="font-bold py-6">Status</td>
                    <td className="font-bold py-6">Data</td>
                    <td className="font-bold py-6 pr-8 text-right">Opcje</td>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { company: "Google", role: "Frontend Engineer", match: 92, status: "Wysłane", date: "2024-03-14" },
                    { company: "Airbnb", role: "Product Designer", match: 88, status: "W toku", date: "2024-03-12" },
                    { company: "Stripe", role: "Fullstack Developer", match: 74, status: "Odrzucone", date: "2024-03-10" },
                  ].map((job, i) => (
                    <tr key={i} className="hover:bg-base-100/50 transition-colors group">
                      <td className="py-6 pl-8">
                        <div className="font-bold text-base-content">{job.role}</div>
                        <div className="text-xs opacity-50 font-medium">{job.company}</div>
                      </td>
                      <td className="py-6">
                        <div className="flex items-center gap-3">
                          <div className={`radial-progress ${job.match > 80 ? 'text-success' : 'text-warning'} bg-base-300 border-4 border-base-300`} 
                               style={{"--value": job.match, "--size": "2.5rem", "--thickness": "3px"} as any} 
                               role="progressbar">
                            <span className="text-[10px] font-bold">{job.match}%</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-6">
                        <div className={`badge badge-ghost font-bold py-3 px-4 border border-base-300`}>
                          {job.status}
                        </div>
                      </td>
                      <td className="py-6 font-medium text-sm opacity-60">
                        {job.date}
                      </td>
                      <td className="py-6 pr-8 text-right">
                        <button className="btn btn-ghost btn-sm btn-square opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink className="w-4 h-4 text-primary" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {(!applications || applications.length === 0) && (
          <div className="py-20 text-center opacity-40 text-lg">Brak aktywnych aplikacji.</div>
        )}

        {/* AI Analyzer Tool */}
        <div className="space-y-8 mt-12">
          <div className="card bg-base-200 border border-primary/20 shadow-xl relative overflow-hidden group text-left">
            <div className="absolute -top-6 -right-6 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
              <TrendingUp className="w-32 h-32 text-primary" />
            </div>
            
            <div className="card-body p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h2 className="card-title text-2xl font-bold text-base-content">AI Analyzer</h2>
              </div>
              <p className="text-base-content/60 mb-6 font-medium">Wklej opis stanowiska, aby sprawdzić jak dobrze pasujesz.</p>

              <div className="space-y-4">
                <div className="form-control">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Wklej treść ogłoszenia..."
                    className="textarea textarea-bordered h-48 bg-base-100 focus:textarea-primary transition-all text-base leading-relaxed"
                  />
                </div>
                <button
                  onClick={() => analyze(description)}
                  disabled={isAnalyzing || !description.trim()}
                  className="btn btn-primary btn-block btn-lg shadow-lg gap-3 font-bold text-lg h-14"
                >
                  {isAnalyzing ? <span className="loading loading-spinner"></span> : <Sparkles className="w-5 h-5" />}
                  Analizuj z AI
                </button>
              </div>
            </div>
          </div>

          {/* Analysis View */}
          {analysis && (
            <div className="card bg-base-200 border border-base-300 shadow-2xl animate-in slide-in-from-bottom-6 duration-500 overflow-hidden text-left">
              <div className="h-1.5 bg-gradient-to-r from-success via-warning to-error" />
              <div className="card-body p-6 space-y-8">
                <div className="flex items-center justify-between border-b border-base-300 pb-4">
                  <span className="text-base-content/50 text-xs font-bold opacity-60">Wynik dopasowania</span>
                  <span className={`text-4xl font-bold ${analysis.match_score >= 75 ? "text-success" : analysis.match_score >= 50 ? "text-warning" : "text-error"}`}>
                    {analysis.match_score}%
                  </span>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-bold text-success mb-3">
                      <CheckCircle2 className="w-5 h-5" /> Zalety
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.pros.map((pro, i) => (
                        <div key={i} className="badge badge-success badge-outline font-bold py-3">
                          {pro}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-bold text-warning mb-3">
                      <AlertCircle className="w-5 h-5" /> Brak umiejętności
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.missing_skills.map((skill, i) => (
                        <div key={i} className="badge badge-warning badge-outline font-bold py-3">
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-base-100/50 p-4 rounded-xl border border-base-300">
                  <p className="text-sm text-base-content/80 leading-relaxed font-medium">
                    "{analysis.summary}"
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
