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
  Clock
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
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Zdrowie</h1>
          <p className="text-gray-400 mt-2">Dbałość o formę zaczyna się od świadomego jedzenia.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {[
          { label: "Kalorie", value: `${Math.round(totalNutrition.calories)} kcal`, icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10" },
          { label: "Białko", value: `${Math.round(totalNutrition.protein)}g`, icon: Beef, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Węglowodany", value: `${Math.round(totalNutrition.carbs)}g`, icon: Wheat, color: "text-yellow-500", bg: "bg-yellow-500/10" },
          { label: "Tłuszcze", value: `${Math.round(totalNutrition.fat)}g`, icon: Dna, color: "text-cyan-500", bg: "bg-cyan-500/10" },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#111114] border border-white/5 p-6 rounded-2xl shadow-xl flex items-center gap-4">
            <div className={`p-3 ${stat.bg} ${stat.color} rounded-xl`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{stat.label}</p>
              <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Meal Logger */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-orange-900/10 to-transparent border border-orange-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-orange-400" />
              <h2 className="text-xl font-bold text-white">AI Meal Logger</h2>
            </div>
            <p className="text-sm text-gray-400 mb-6">Poinformuj AI co zjadłeś, a my policzymy makroskładniki.</p>

            <div className="space-y-4">
              <textarea
                value={mealText}
                onChange={(e) => setMealText(e.target.value)}
                placeholder="Np. 2 jajka sadzone na maśle, 2 kromki chleba razowego..."
                className="w-full bg-[#1c1c21] border border-white/5 rounded-xl p-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all min-h-[150px] text-sm resize-none"
              />
              
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <button
                onClick={() => logMeal(mealText)}
                disabled={isPending || !mealText.trim()}
                className="w-full bg-orange-600 hover:bg-orange-500 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Utensils className="w-4 h-4" />}
                Dodaj posiłek
              </button>
            </div>
          </div>
        </div>

        {/* Meal History */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#111114] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-white/5 flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <h2 className="text-lg font-bold text-white">Historia dzisiejszych posiłków</h2>
            </div>
            
            <div className="divide-y divide-white/5">
              {meals?.length === 0 && (
                <div className="py-12 text-center text-gray-500">Brak zalogowanych posiłków.</div>
              )}
              {meals?.map((meal) => (
                <div key={meal.id} className="p-6 hover:bg-white/[0.01] transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-white font-medium leading-relaxed">{meal.description}</p>
                      <div className="flex gap-4 text-[10px] font-bold uppercase tracking-wider">
                        <span className="text-orange-500">{meal.calories} kcal</span>
                        <span className="text-blue-500">B: {meal.protein}g</span>
                        <span className="text-yellow-500">W: {meal.carbs}g</span>
                        <span className="text-cyan-500">T: {meal.fat}g</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-600 font-mono">
                      {new Date(meal.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
