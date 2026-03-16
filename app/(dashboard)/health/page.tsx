"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, getApiError } from "@/lib/api";
import { MealLog } from "@/types/api";
import { 
  Loader2, 
  Utensils, 
  Sparkles, 
  Dna, 
  Beef, 
  Wheat, 
  Flame,
  AlertCircle,
  Clock,
  CheckCircle2,
  Trash2
} from "lucide-react";

export default function HealthPage() {
  const [mealText, setMealText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: meals, isLoading } = useQuery<MealLog[]>({
    queryKey: ["meals"],
    queryFn: async () => {
      const response = await api.get("/health/meals");
      return response.data;
    },
  });

  const deleteMealMutation = useMutation({
    mutationFn: async (mealId: number) => {
      await api.delete(`/health/meals/${mealId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-today"] });
    },
    onError: (err) => {
      console.error("Failed to delete meal:", err);
    },
  });

  const { mutate: logMeal, isPending } = useMutation({
    mutationFn: async (text: string) => {
      const response = await api.post("/health/log-meal-ai", { text });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-today"] });
      setMealText("");
      setError(null);
    },
    onError: (err) => {
      setError(getApiError(err));
    }
  });

  const totalNutrition = meals?.reduce((acc, meal) => ({
    calories: acc.calories + (meal.calories || 0),
    protein: acc.protein + (meal.protein || 0),
    carbs: acc.carbs + (meal.carbs || 0),
    fat: acc.fat + (meal.fat || 0),
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 }) || { calories: 0, protein: 0, carbs: 0, fat: 0 };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="loading loading-ring loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl lg:text-5xl font-display text-base-content tracking-tight border-l-4 border-primary pl-4">Zdrowie</h1>
          <p className="text-base-content/60 mt-2 font-display tracking-wide text-[9px]">Dbałość o formę zaczyna się od świadomego jedzenia.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 text-left">
        {[
          { label: "Kalorie", value: `${Math.round(totalNutrition.calories)} kcal`, icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10", badge: "primary" },
          { label: "Białko", value: `${Math.round(totalNutrition.protein)}g`, icon: Beef, color: "text-secondary", bg: "bg-secondary/10", badge: "secondary" },
          { label: "Węglowody", value: `${Math.round(totalNutrition.carbs)}g`, icon: Wheat, color: "text-blue-400", bg: "bg-blue-400/10", badge: "primary" },
          { label: "Tłuszcze", value: `${Math.round(totalNutrition.fat)}g`, icon: Dna, color: "text-purple-400", bg: "bg-purple-400/10", badge: "secondary" },
        ].map((stat) => (
          <div key={stat.label} className="card bg-base-200/50 backdrop-blur-md border border-white/5 shadow-2xl overflow-hidden group">
            <div className="card-body p-8 flex flex-row items-center gap-6">
              <div className={`p-5 ${stat.bg} ${stat.color} rounded-2xl group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(0,0,0,0.3)] border border-white/5`}>
                <stat.icon className="w-10 h-10" />
              </div>
              <div>
                <p className="text-[10px] font-display opacity-40 tracking-wider">Statystyka</p>
                <p className={`text-4xl font-display ${stat.color} tracking-tighter`}>{stat.value}</p>
                <div className={`badge badge-${stat.badge} badge-xs mt-1 font-display tracking-tighter`}>Dzisiaj</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
        {/* Meal Logger */}
        <div className="lg:col-span-1">
          <div className="card bg-base-200/50 backdrop-blur-md border border-primary/20 shadow-[0_0_40px_rgba(123,46,255,0.1)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            <div className="card-body p-8 space-y-8">
              <div className="flex flex-col gap-4">
                <div className="p-3 bg-primary/20 rounded-2xl w-fit shadow-inner border border-white/5">
                  <Sparkles className="w-8 h-8 text-primary shadow-primary" />
                </div>
                <div>
                  <h2 className="card-title text-2xl font-display text-base-content tracking-tight">AI Meal Logger</h2>
                  <p className="text-base-content/60 font-display tracking-wide text-[9px] mt-1 pr-4 leading-relaxed">Poinformuj AI co zjadłeś, a my policzymy makroskładniki.</p>
                </div>
              </div>

              <div className="form-control space-y-6">
                <textarea
                  value={mealText}
                  onChange={(e) => setMealText(e.target.value)}
                  placeholder="Np. 2 jajka sadzone na maśle, 2 kromki chleba razowego..."
                  className="textarea textarea-bordered h-56 bg-base-100/50 border-white/5 focus:textarea-primary transition-all text-base leading-relaxed font-sans p-6 rounded-2xl resize-none"
                />
                
                {error && (
                  <div className="alert alert-error rounded-xl border-none shadow-lg py-4">
                    <AlertCircle className="w-6 h-6" />
                    <span className="font-display tracking-wider text-[10px] leading-tight">{error}</span>
                  </div>
                )}

                <button
                  onClick={() => logMeal(mealText)}
                  disabled={isPending || !mealText.trim()}
                  className="btn btn-primary btn-block btn-lg shadow-[0_0_20px_rgba(123,46,255,0.2)] gap-4 font-display text-lg h-12 transition-all hover:scale-[1.01]"
                >
                  {isPending ? <span className="loading loading-spinner"></span> : <Utensils className="w-6 h-6" />}
                  Dodaj posiłek
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Meal History */}
        <div className="lg:col-span-2">
          <div className="card bg-base-200/50 backdrop-blur-md border border-white/5 shadow-2xl overflow-hidden h-full">
            <div className="card-body p-0">
              <div className="p-8 border-b border-white/5 flex items-center gap-4 bg-base-300/30">
                <div className="p-3 bg-base-300/50 rounded-2xl border border-white/5">
                  <Clock className="w-6 h-6 opacity-40" />
                </div>
                <h2 className="card-title text-xl font-display text-base-content tracking-tight">Historia posiłków</h2>
              </div>
              
              <div className="divide-y divide-white/5 max-h-[660px] overflow-y-auto">
                {meals?.length === 0 && (
                  <div className="py-32 text-center opacity-40 font-display font-bold text-xl uppercase tracking-widest italic">Brak zalogowanych posiłków.</div>
                )}
                {meals?.map((meal) => (
                  <div key={meal.id} className="p-8 hover:bg-primary/5 transition-all group border-b border-white/5">
                    <div className="flex items-start justify-between gap-6">
                      <div className="space-y-4 flex-1">
                        <p className="text-base-content font-display text-xl leading-tight group-hover:text-primary transition-colors tracking-tight">{meal.description}</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="badge badge-primary font-display text-[9px] py-3 px-4 tracking-wide border-none shadow-lg">{meal.calories} kcal</span>
                          <span className="badge badge-secondary font-display text-[9px] py-3 px-4 tracking-wide border-none shadow-lg">B: {meal.protein}g</span>
                          <span className="badge badge-secondary badge-outline font-display text-[9px] py-3 px-4 tracking-wide border-white/10 shadow-lg">W: {meal.carbs}g</span>
                          <span className="badge badge-primary badge-outline font-display text-[9px] py-3 px-4 tracking-wide border-white/10 shadow-lg">T: {meal.fat}g</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        <span className="text-[9px] font-display opacity-30 group-hover:opacity-60 transition-opacity tracking-wider bg-base-300/50 px-2 py-1 rounded-lg border border-white/5">
                          {new Date(meal.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <button
                          onClick={() => deleteMealMutation.mutate(meal.id)}
                          className="btn btn-ghost btn-sm text-error/20 hover:text-error hover:bg-error/10 transition-all rounded-xl"
                          disabled={deleteMealMutation.isPending}
                        >
                          {deleteMealMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
