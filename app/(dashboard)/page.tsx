"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DashboardToday } from "@/types/api";
import { 
  CheckCircle2,
  Zap,
  Calendar, 
  Sparkles, 
  BarChart3 
} from "lucide-react";
import HustleInput from "@/components/finance/HustleInput";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { data, isLoading } = useQuery<DashboardToday>({
    queryKey: ["dashboard-today"],
    queryFn: async () => {
      const response = await api.get("/goals/dashboard/today");
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-10 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="space-y-3">
            <Skeleton className="h-10 w-[220px]" />
            <Skeleton className="h-4 w-[360px]" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-5 w-48" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-[420px] rounded-2xl" />
            <Skeleton className="h-[360px] rounded-2xl" />
          </div>
          <div className="space-y-8">
            <Skeleton className="h-60 rounded-2xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
              <Skeleton className="h-56 rounded-2xl" />
              <Skeleton className="h-56 rounded-2xl" />
            </div>
            <Skeleton className="h-56 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  const tasks = data?.tasks || [];
  const habits = data?.habits || [];

  const items = [
    ...tasks.map(task => ({ ...task, category: 'TASK' })),
    ...habits.map(habit => ({ ...habit, category: 'HABIT' })),
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl font-display text-foreground tracking-tight mb-2">Dashboard</h1>
          <p className="text-sm text-muted-foreground font-sans">Welcome back! Here’s your day at a glance.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-card/60 rounded-xl border border-border/60 shadow-2xl">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div className="text-right">
            <p className="text-xs font-display opacity-40 tracking-wide">Today is</p>
            <p className="font-display text-lg tracking-tight">{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-card/60 backdrop-blur-md border border-border/60 shadow-2xl">
            <CardHeader className="p-6 flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-display text-foreground tracking-wide">Today’s tasks</CardTitle>
              <Button variant="ghost" size="sm" className="text-primary font-display tracking-tight">
                View all
              </Button>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="space-y-4 font-sans">
                {items.filter(i => i.category === 'TASK').map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-background/40 rounded-2xl border border-border/60 hover:border-primary/50 hover:bg-accent/30 transition-all group">
                    <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary group-hover:text-primary-content transition-colors shadow-[0_0_15px_rgba(123,46,255,0.3)]">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground">{item.title}</p>
                      <p className="text-xs font-display opacity-50 tracking-wide">Due: Today, 6:00 PM</p>
                    </div>
                    <Badge variant="outline" className="border-white/10 font-display px-3 py-3 tracking-tighter whitespace-nowrap">
                      In progress
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-md border border-border/60 shadow-2xl overflow-hidden">
            <CardHeader className="p-6 flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-display text-foreground tracking-wide">Habits</CardTitle>
              <Sparkles className="w-5 h-5 text-secondary animate-pulse" />
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
                {items.filter(i => i.category === 'HABIT').map((item) => (
                  <div key={item.id} className="p-4 bg-background/40 rounded-2xl border border-border/60">
                    <div className="flex items-center justify-between mb-3 font-display">
                      <span className="text-xs text-secondary tracking-wide">Daily</span>
                      <span className="text-xs opacity-60">75%</span>
                    </div>
                    <p className="text-foreground mb-3 tracking-tight">{item.title}</p>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden border border-border/60">
                        <div className="bg-secondary h-full rounded-full w-3/4 shadow-[0_0_15px_rgba(0,212,255,0.5)]" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="bg-primary text-primary-content shadow-[0_0_50px_rgba(123,46,255,0.2)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <BarChart3 className="w-32 h-32" />
            </div>
            <CardContent className="p-8 relative">
              <h3 className="text-xs font-display mb-4 tracking-wide opacity-80">AI insight</h3>
              <p className="text-xl font-display leading-tight mb-6">
                “Your productivity is up by 15%. Keep it up!”
              </p>
              <div className="flex items-center gap-2 text-xs font-display opacity-80 border-t border-primary-content/20 pt-4 tracking-tight">
                <Zap className="w-4 h-4 fill-current" />
                Analysis completed 5 minutes ago
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
            <HustleInput type="INCOME" />
            <HustleInput type="EXPENSE" />
          </div>

          <Card className="bg-card/60 backdrop-blur-md border border-border/60 shadow-2xl">
             <CardContent className="p-6">
                <h3 className="text-xs font-display mb-4 tracking-wider opacity-40">Quick overview</h3>
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <p className="text-xs font-display tracking-wide opacity-60">Finance</p>
                      <p className={`text-lg font-display tracking-tighter ${data?.finance_balance && data.finance_balance >= 0 ? 'text-secondary' : 'text-destructive'}`}>
                        {data?.finance_balance ? (data.finance_balance > 0 ? `+${data.finance_balance}` : data.finance_balance) : '0'} PLN
                      </p>
                   </div>
                   <div className="flex items-center justify-between">
                      <p className="text-xs font-display tracking-wide opacity-60">Health</p>
                      <p className="text-lg font-display text-secondary tracking-tighter">{Math.round(data?.health_calories || 0)} kcal</p>
                   </div>
                   <div className="flex items-center justify-between">
                      <p className="text-xs font-display tracking-wide opacity-60">Goals</p>
                      <p className="text-lg font-display text-secondary tracking-tighter">{data?.active_goals_count || 0} active</p>
                   </div>
                </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
