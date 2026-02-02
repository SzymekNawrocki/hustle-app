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

  const getScoreColor = (score: number) => {
    if (score < 50) return "text-red-500 bg-red-500/10";
    if (score < 75) return "text-yellow-500 bg-yellow-500/10";
    return "text-green-500 bg-green-500/10";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Kariera</h1>
          <p className="text-gray-400 mt-2">Zarządzaj swoimi aplikacjami i analizuj dopasowanie.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all active:scale-[0.95]">
          <Plus className="w-5 h-5" />
          Dodaj aplikację
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Applications List */}
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-[#111114] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Firma & Stanowisko</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Match Score</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {applications?.map((app) => (
                  <tr key={app.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-white font-medium">{app.company}</span>
                        <span className="text-xs text-gray-500">{app.position}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-[10px] bg-white/5 text-gray-400 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${getScoreColor(app.match_score || 0)}`}>
                        {app.match_score || 0}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-gray-600 hover:text-white transition-colors">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {applications?.length === 0 && (
              <div className="py-12 text-center text-gray-500">Brak aktywnych aplikacji.</div>
            )}
          </div>
        </div>

        {/* AI Analyzer Tool */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-900/10 to-transparent border border-blue-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <TrendingUp className="w-16 h-16 text-blue-500" />
            </div>
            
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-bold text-white">AI Analyzer</h2>
            </div>
            <p className="text-sm text-gray-400 mb-6">Wklej opis stanowiska, aby sprawdzić jak dobrze pasujesz.</p>

            <div className="space-y-4">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Wklej treść ogłoszenia..."
                className="w-full bg-[#1c1c21] border border-white/5 rounded-xl p-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all min-h-[150px] text-sm resize-none"
              />
              <button
                onClick={() => analyze(description)}
                disabled={isAnalyzing || !description.trim()}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Analizuj z AI
              </button>
            </div>
          </div>

          {/* Analysis View */}
          {analysis && (
            <div className="bg-[#111114] border border-white/5 rounded-2xl p-6 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Wynik dopasowania</span>
                <span className={`text-xl font-bold ${getScoreColor(analysis.match_score)} bg-transparent px-0`}>
                  {analysis.match_score}%
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-bold text-green-500 mb-2">
                    <CheckCircle2 className="w-4 h-4" /> Zalety
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.pros.map((pro, i) => (
                      <span key={i} className="text-[10px] bg-green-500/5 text-green-500/80 border border-green-500/10 px-2 py-1 rounded-md">
                        {pro}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="flex items-center gap-2 text-sm font-bold text-orange-500 mb-2">
                    <AlertCircle className="w-4 h-4" /> Brakujące umiejętności
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missing_skills.map((skill, i) => (
                      <span key={i} className="text-[10px] bg-orange-500/5 text-orange-500/80 border border-orange-500/10 px-2 py-1 rounded-md">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-500 italic leading-relaxed pt-4 border-t border-white/5">
                "{analysis.summary}"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
