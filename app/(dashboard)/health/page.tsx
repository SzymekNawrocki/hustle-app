"use client";

import { useState } from "react";
import { getApiError } from "@/lib/api";
import { MealLog } from "@/types/api";
import { useHealth } from "@/hooks/use-health";
import { useDashboard } from "@/hooks/use-dashboard";
import {
  Utensils,
  Sparkles,
  Dna,
  Beef,
  Wheat,
  Flame,
  AlertCircle,
  Clock,
  Trash2
} from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

const LIMIT = 20;

export default function HealthPage() {
  const [mealText, setMealText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { meals, deleteMeal, logMeal } = useHealth();
  const { data: dashboard } = useDashboard();

  const todayMeals = dashboard?.today_meals ?? [];
  const totalNutrition = todayMeals.reduce(
    (acc, meal: MealLog) => ({
      calories: acc.calories + (meal.calories || 0),
      protein: acc.protein + (meal.protein || 0),
      carbs: acc.carbs + (meal.carbs || 0),
      fat: acc.fat + (meal.fat || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  if (meals.isLoading) {
    return (
      <div className="space-y-10 font-sans">
        <div className="space-y-3">
          <Skeleton className="h-10 w-[220px]" />
          <Skeleton className="h-4 w-[360px]" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="h-[560px] rounded-2xl" />
          <Skeleton className="lg:col-span-2 h-[560px] rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl lg:text-5xl font-display text-foreground tracking-tight border-l-4 border-primary pl-4">Health</h1>
          <p className="text-muted-foreground mt-2 font-display tracking-wide text-xs">Fitness starts with mindful eating.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 text-left">
        {[
          { label: "Calories", value: `${Math.round(totalNutrition.calories)} kcal`, icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10", badge: "primary" },
          { label: "Protein", value: `${Math.round(totalNutrition.protein)}g`, icon: Beef, color: "text-secondary", bg: "bg-secondary/10", badge: "secondary" },
          { label: "Carbs", value: `${Math.round(totalNutrition.carbs)}g`, icon: Wheat, color: "text-blue-400", bg: "bg-blue-400/10", badge: "primary" },
          { label: "Fat", value: `${Math.round(totalNutrition.fat)}g`, icon: Dna, color: "text-purple-400", bg: "bg-purple-400/10", badge: "secondary" },
        ].map((stat) => (
          <Card key={stat.label} className="bg-card/60 backdrop-blur-md border border-border/60 shadow-2xl overflow-hidden group">
            <CardContent className="p-8 flex flex-row items-center gap-6">
              <div className={`p-5 ${stat.bg} ${stat.color} rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.3)] border border-border/60`}>
                <stat.icon className="w-10 h-10" />
              </div>
              <div>
                <p className="text-xs font-display text-muted-foreground tracking-wide">Today</p>
                <p className={`text-4xl font-display ${stat.color} tracking-tighter`}>{stat.value}</p>
                <Badge variant={stat.badge === "secondary" ? "secondary" : "default"} className="mt-1 font-display tracking-tighter">
                  {stat.label}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
        {/* Meal Logger */}
        <div className="lg:col-span-1">
          <Card className="bg-card/60 backdrop-blur-md border border-primary/30 shadow-[0_0_40px_rgba(123,46,255,0.12)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            <CardContent className="p-8 space-y-8">
              <div className="flex flex-col gap-4">
                <div className="p-3 bg-primary/20 rounded-2xl w-fit shadow-inner border border-white/5">
                  <Sparkles className="w-8 h-8 text-primary shadow-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-display text-foreground tracking-tight">AI Meal Logger</h2>
                  <p className="text-muted-foreground font-display tracking-wide text-xs mt-1 pr-4 leading-relaxed">Tell AI what you ate and we'll calculate your macros.</p>
                </div>
              </div>

              <div className="form-control space-y-6">
                <Textarea
                  value={mealText}
                  onChange={(e) => setMealText(e.target.value)}
                  placeholder="e.g. 2 fried eggs with butter, 2 slices of whole-grain bread..."
                  className="h-56 bg-background/40 border-border/60 text-base leading-relaxed font-sans p-6 rounded-2xl resize-none"
                />

                {error && (
                  <Alert variant="destructive" className="rounded-xl border-none shadow-lg py-4">
                    <AlertCircle className="w-6 h-6" />
                    <AlertDescription className="font-display tracking-wide text-xs leading-tight">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={() =>
                    logMeal.mutate(mealText, {
                      onSuccess: () => { setMealText(""); setError(null); },
                      onError: (err) => setError(getApiError(err)),
                    })
                  }
                  disabled={logMeal.isPending || !mealText.trim()}
                  className="w-full shadow-[0_0_20px_rgba(123,46,255,0.2)] gap-4 font-display text-lg h-12"
                >
                  {logMeal.isPending ? (
                    <span className="h-4 w-4 rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground animate-spin" />
                  ) : (
                    <Utensils className="w-6 h-6" />
                  )}
                  Add meal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Meal History */}
        <div className="lg:col-span-2">
          <Card className="bg-card/60 backdrop-blur-md border border-border/60 shadow-2xl overflow-hidden h-full">
            <CardHeader className="p-8 border-b border-border/60 flex flex-row items-center gap-4 bg-muted/30">
                <div className="p-3 bg-muted/40 rounded-2xl border border-border/60">
                  <Clock className="w-6 h-6 opacity-40" />
                </div>
                <CardTitle className="text-xl font-display text-foreground tracking-tight">Meal history</CardTitle>
            </CardHeader>

            <CardContent className="p-0">
              <div className="divide-y divide-white/5 max-h-[660px] overflow-y-auto">
                {meals.data?.items.length === 0 && (
                  <div className="py-32 text-center opacity-40 font-display font-bold text-xl uppercase tracking-widest italic">No meals logged yet.</div>
                )}
                {meals.data?.items.map((meal: MealLog) => (
                  <div key={meal.id} className="p-8 group border-b border-white/5">
                    <div className="flex items-start justify-between gap-6">
                      <div className="space-y-4 flex-1">
                        <p className="text-foreground font-display text-xl leading-tight tracking-tight">{meal.description}</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="font-display text-xs py-2.5 px-4 tracking-wide border-none shadow-lg">
                            {meal.calories} kcal
                          </Badge>
                          <Badge variant="secondary" className="font-display text-xs py-2.5 px-4 tracking-wide border-none shadow-lg">
                            B: {meal.protein}g
                          </Badge>
                          <Badge variant="outline" className="font-display text-xs py-2.5 px-4 tracking-wide border-white/10 shadow-lg">
                            W: {meal.carbs}g
                          </Badge>
                          <Badge variant="outline" className="font-display text-xs py-2.5 px-4 tracking-wide border-white/10 shadow-lg">
                            T: {meal.fat}g
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        <span className="text-xs font-display opacity-60 tracking-wide bg-muted/30 px-2 py-1 rounded-lg border border-border/60">
                          {new Date(meal.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <Button
                          onClick={() => deleteMeal.mutate(meal.id)}
                          variant="ghost"
                          size="icon-sm"
                          className="text-destructive/60 hover:text-destructive hover:bg-destructive/10 rounded-xl"
                          disabled={deleteMeal.isPending}
                        >
                          {deleteMeal.isPending ? (
                            <span className="h-4 w-4 rounded-full border-2 border-current/30 border-t-current animate-spin" />
                          ) : (
                            <Trash2 className="w-5 h-5" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {meals.data && meals.data.pages > 1 && (
                <div className="flex items-center justify-center gap-4 p-6 border-t border-border/60">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={meals.prevPage}
                    disabled={!meals.hasPrevPage}
                    className="font-display tracking-wide text-xs"
                  >
                    ← Prev
                  </Button>
                  <span className="text-xs font-display opacity-40 tracking-wide">
                    {meals.page} / {meals.data.pages} &nbsp;·&nbsp; {meals.data.total} meals
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={meals.nextPage}
                    disabled={!meals.hasNextPage}
                    className="font-display tracking-wide text-xs"
                  >
                    Next →
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
