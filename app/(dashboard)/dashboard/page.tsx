"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DashboardToday, ActivityHistory } from "@/types/api";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip
} from "recharts";
import { 
  Briefcase, 
  Utensils, 
  Receipt, 
  Target, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock,
  TrendingUp,
  Wallet
} from "lucide-react";

export default function DashboardPage() {
  const { data, isLoading } = useQuery<DashboardToday>({
    queryKey: ["dashboard-today"],
    queryFn: async () => {
      const response = await api.get("/goals/dashboard/today");
      return response.data;
    },
  });

  const { data: historyData, isLoading: isHistoryLoading } = useQuery<ActivityHistory>({
    queryKey: ["activity-history"],
    queryFn: async () => {
      const response = await api.get("/goals/activity/history");
      return response.data;
    },
  });

  if (isLoading || isHistoryLoading) return <div className="p-10">Ładowanie...</div>;

  const stats = [
    { label: "Aktywne Cele", value: `${data?.active_goals_count || 0}`, color: "text-blue-500" },
    { label: "Finanse (Dziś)", value: `${data?.finance_balance || 0} zł`, color: data?.finance_balance && data.finance_balance >= 0 ? "text-emerald-500" : "text-error" },
    { label: "Dzisiejsze Kalorie", value: `${Math.round(data?.health_calories || 0)} kcal`, color: "text-orange-500" },
    { label: "Nawyki", value: `${data?.habits.length || 0}`, color: "text-cyan-500" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display text-white tracking-tight">Witaj w HustleOS</h1>
        <p className="text-gray-400 mt-2 font-display text-[9px] tracking-wide">Oto podsumowanie Twoich postępów.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-[#111114] border border-white/5 p-6 rounded-2xl">
            <p className="text-[10px] font-display text-gray-500 tracking-wider whitespace-nowrap">{stat.label}</p>
            <p className={`text-2xl font-display mt-2 ${stat.color} tracking-tighter`}>{stat.value}</p>
          </div>
        ))}
      </div>
      
      <div className="h-[450px] bg-[#111114] border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
        <div className="flex items-center justify-between mb-8">
           <div>
              <h3 className="text-sm font-display text-gray-400 tracking-widest uppercase mb-1">Aktywność</h3>
              <p className="text-[9px] text-gray-600 font-sans">Ostatnie 7 dni Twojego sukcesu</p>
           </div>
        </div>
        
        <ResponsiveContainer width="100%" height="80%">
          <AreaChart data={historyData?.days}>
            <defs>
              <linearGradient id="colorFinance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7B2EFF" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#7B2EFF" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00D4FF" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
            <XAxis 
               dataKey="date" 
               axisLine={false} 
               tickLine={false} 
               tick={{ fill: '#374151', fontSize: 10, fontFamily: 'var(--font-display)' }} 
               dy={10}
            />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip 
               contentStyle={{ 
                  backgroundColor: '#0D0D0D', 
                  border: '1px solid rgba(255,255,255,0.05)', 
                  borderRadius: '1rem',
                  fontSize: '10px',
                  fontFamily: 'var(--font-display)',
                  color: '#fff' 
               }}
               itemStyle={{ color: '#fff' }}
            />
            <Area 
               type="monotone" 
               dataKey="finance" 
               stroke="#7B2EFF" 
               strokeWidth={3}
               fillOpacity={1} 
               fill="url(#colorFinance)" 
               name="Finanse (zł)"
            />
            <Area 
               type="monotone" 
               dataKey="health" 
               stroke="#00D4FF" 
               strokeWidth={3}
               fillOpacity={1} 
               fill="url(#colorHealth)" 
               name="Kalorie (kcal)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ostatnie Oferty Pracy */}
        <div className="bg-[#111114] border border-white/5 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-display text-white uppercase tracking-wider">Ostatnie Oferty</h3>
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-600" />
          </div>
          <div className="space-y-4">
            {data?.recent_offers?.length ? (
              data.recent_offers.map((offer) => (
                <div key={offer.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/[0.08] transition-all">
                  <div>
                    <p className="text-xs text-white font-sans font-medium">{offer.title}</p>
                    <p className="text-[10px] text-gray-500 font-display">{offer.company || "Nieznana firma"}</p>
                  </div>
                  <div className={`text-[9px] px-2 py-1 rounded-full border border-white/10 uppercase font-display tracking-tighter ${
                    offer.status === 'umowa' ? 'text-emerald-500 bg-emerald-500/10' : 'text-gray-400'
                  }`}>
                    {offer.status}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-600 italic">Brak wysłanych ofert.</p>
            )}
          </div>
        </div>

        {/* Dzisiejsze Posiłki */}
        <div className="bg-[#111114] border border-white/5 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 text-orange-500 rounded-lg">
                <Utensils className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-display text-white uppercase tracking-wider">Zjedzone dzisiaj</h3>
            </div>
            <p className="text-xs font-display text-orange-500">{Math.round(data?.health_calories || 0)} kcal</p>
          </div>
          <div className="space-y-4">
            {data?.today_meals?.length ? (
              data.today_meals.map((meal) => (
                <div key={meal.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-xs text-white font-sans">{meal.description}</p>
                  <p className="text-[10px] text-gray-500 font-display">{meal.calories} kcal</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-600 italic">Nie zanotowano jeszcze posiłków.</p>
            )}
          </div>
        </div>

        {/* Ostatnie Wydatki */}
        <div className="bg-[#111114] border border-white/5 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                <Receipt className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-display text-white uppercase tracking-wider">Ostatnie Wydatki</h3>
            </div>
            <div className="flex items-center gap-2 text-emerald-500">
               <Wallet className="w-4 h-4" />
               <p className="text-xs font-display">{data?.finance_balance} zł</p>
            </div>
          </div>
          <div className="space-y-4">
            {data?.recent_expenses?.length ? (
              data.recent_expenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                  <div>
                    <p className="text-xs text-white font-sans">{expense.description}</p>
                    <p className="text-[9px] text-gray-500 uppercase font-display">{expense.category}</p>
                  </div>
                  <p className={`text-xs font-display ${expense.category === 'INCOME' ? 'text-emerald-500' : 'text-error'}`}>
                    {expense.category === 'INCOME' ? '+' : '-'}{expense.amount} zł
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-600 italic">Brak ostatnich wydatków.</p>
            )}
          </div>
        </div>

        {/* Ostatni Cel */}
        <div className="bg-[#111114] border border-white/5 rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-700">
             <Target className="w-24 h-24" />
          </div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 text-primary rounded-lg">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-display text-white uppercase tracking-wider">Ostatni Cel</h3>
            </div>
          </div>
          {data?.latest_goal ? (
            <div className="space-y-4 relative z-10">
              <div>
                <h4 className="text-lg font-display text-white tracking-tight">{data.latest_goal.title}</h4>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{data.latest_goal.description}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-display uppercase tracking-widest text-gray-500">
                  <span>Postęp</span>
                  <span>{data.latest_goal.progress_percentage || 0}%</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="bg-primary h-full transition-all duration-1000" 
                    style={{ width: `${data.latest_goal.progress_percentage || 0}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-4 text-[9px] font-display text-gray-600 uppercase">
                 <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {data.latest_goal.milestones.length} Kroki
                 </div>
                 <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Target: {data.latest_goal.target_date || "Brak"}
                 </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-600 italic">Brak celów w toku.</p>
          )}
        </div>
      </div>
    </div>
  );
}
