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
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-base-content tracking-tight">Zdrowie</h1>
          <p className="text-base-content/60 mt-2 font-medium">Dbałość o formę zaczyna się od świadomego jedzenia.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 text-left">
        {[
          { label: "Kalorie", value: `${Math.round(totalNutrition.calories)} kcal`, icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10", badge: "badge-warning" },
          { label: "Białko", value: `${Math.round(totalNutrition.protein)}g`, icon: Beef, color: "text-blue-500", bg: "bg-blue-500/10", badge: "badge-primary" },
          { label: "Węglowody", value: `${Math.round(totalNutrition.carbs)}g`, icon: Wheat, color: "text-yellow-500", bg: "bg-yellow-500/10", badge: "badge-secondary" },
          { label: "Tłuszcze", value: `${Math.round(totalNutrition.fat)}g`, icon: Dna, color: "text-cyan-500", bg: "bg-cyan-500/10", badge: "badge-accent" },
        ].map((stat) => (
          <div key={stat.label} className="card bg-base-200 border border-base-300 shadow-xl overflow-hidden group">
            <div className="card-body p-6 flex flex-row items-center gap-4">
              <div className={`p-4 ${stat.bg} ${stat.color} rounded-2xl group-hover:scale-110 transition-transform shadow-inner`}>
                <stat.icon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-[10px] font-bold opacity-40">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <div className={`badge ${stat.badge} badge-outline badge-xs mt-1 font-bold`}>Dzisiaj</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
        {/* Meal Logger */}
        <div className="lg:col-span-1">
          <div className="card bg-base-200 border border-warning/20 shadow-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-warning/5 to-transparent pointer-events-none" />
            <div className="card-body p-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <Sparkles className="w-6 h-6 text-warning" />
                </div>
                <h2 className="card-title text-2xl font-bold text-base-content">AI Meal Logger</h2>
              </div>
              <p className="text-base-content/60 font-medium leading-relaxed">Poinformuj AI co zjadłeś, a my policzymy makroskładniki.</p>

              <div className="form-control space-y-4">
                <textarea
                  value={mealText}
                  onChange={(e) => setMealText(e.target.value)}
                  placeholder="Np. 2 jajka sadzone na maśle, 2 kromki chleba razowego..."
                  className="textarea textarea-bordered h-48 bg-base-100 focus:textarea-warning transition-all text-base leading-relaxed"
                />
                
                {error && (
                  <div className="alert alert-error shadow-lg py-3 rounded-xl border-none">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-xs font-bold leading-tight">{error}</span>
                  </div>
                )}

                <button
                  onClick={() => logMeal(mealText)}
                  disabled={isPending || !mealText.trim()}
                  className="btn btn-warning btn-block btn-lg shadow-lg gap-3 font-bold text-lg h-14"
                >
                  {isPending ? <span className="loading loading-spinner"></span> : <Utensils className="w-5 h-5" />}
                  Dodaj posiłek
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Meal History */}
        <div className="lg:col-span-2">
          <div className="card bg-base-200 border border-base-300 shadow-xl overflow-hidden h-full">
            <div className="card-body p-0">
              <div className="p-6 border-b border-base-300 flex items-center gap-3 bg-base-200/30">
                <div className="p-2 bg-base-300/50 rounded-lg">
                  <Clock className="w-5 h-5 opacity-60" />
                </div>
                <h2 className="card-title text-xl font-bold text-base-content">Historia dzisiejszych posiłków</h2>
              </div>
              
              <div className="divide-y divide-base-300 max-h-[600px] overflow-y-auto">
                {meals?.length === 0 && (
                  <div className="py-20 text-center opacity-40 text-lg">Brak zalogowanych posiłków.</div>
                )}
                {meals?.map((meal) => (
                  <div key={meal.id} className="p-6 hover:bg-base-100 transition-all border-b border-base-300/50 group">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-3 flex-1">
                        <p className="text-base-content font-bold text-lg leading-snug group-hover:text-primary transition-colors">{meal.description}</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="badge badge-warning badge-outline font-bold text-[10px] py-3 px-3 shadow-sm">{meal.calories} kcal</span>
                          <span className="badge badge-primary badge-outline font-bold text-[10px] py-3 px-3 shadow-sm">B: {meal.protein}g</span>
                          <span className="badge badge-secondary badge-outline font-bold text-[10px] py-3 px-3 shadow-sm">W: {meal.carbs}g</span>
                          <span className="badge badge-accent badge-outline font-bold text-[10px] py-3 px-3 shadow-sm">T: {meal.fat}g</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-[10px] font-medium opacity-30 group-hover:opacity-60 transition-opacity">
                          {new Date(meal.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <button
                          onClick={() => deleteMealMutation.mutate(meal.id)}
                          className="btn btn-ghost btn-sm text-error hover:bg-error/10"
                          disabled={deleteMealMutation.isPending}
                        >
                          {deleteMealMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
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
