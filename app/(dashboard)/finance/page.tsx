"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Expense, ExpenseCategory } from "@/types/api";
import { 
  Loader2, 
  Trash2,
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  Activity,
  PieChart as PieChartIcon
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip
} from "recharts";
import HustleInput from "@/components/finance/HustleInput";

const CATEGORY_COLORS: Record<string, string> = {
  OPLATY: "#ff4d4d",
  HUSTLE: "#7B2EFF",
  LIFESTYLE: "#00D4FF",
  INCOME: "#22c55e",
};

export default function FinancePage() {
  const queryClient = useQueryClient();
  
  const { data: expenses, isLoading } = useQuery<Expense[]>({
    queryKey: ["expenses"],
    queryFn: async () => {
      const response = await api.get("/finance/expenses");
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/finance/expenses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-today"] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="loading loading-ring loading-lg text-primary"></span>
      </div>
    );
  }

  const totalIncome = expenses?.filter(e => e.category === ExpenseCategory.INCOME).reduce((acc, e) => acc + e.amount, 0) || 0;
  const totalExpenses = expenses?.filter(e => e.category !== ExpenseCategory.INCOME).reduce((acc, e) => acc + e.amount, 0) || 0;
  const balance = totalIncome - totalExpenses;

  const chartData = Object.keys(CATEGORY_COLORS).map(cat => ({
    name: cat,
    value: expenses?.filter(e => e.category === cat).reduce((acc, e) => acc + e.amount, 0) || 0
  })).filter(d => d.value > 0);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 font-sans pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-5xl font-display text-base-content tracking-tight border-l-4 border-primary pl-4 uppercase">Finance Flow</h1>
          <p className="text-base-content/60 mt-2 font-display tracking-wide text-[9px] uppercase opacity-50">Zarządzanie majątkiem 3 koszyków</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="stat bg-base-200/50 backdrop-blur-md border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden group hover:border-primary/20 transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
               <Wallet className="w-24 h-24" />
            </div>
            <div className="stat-title font-display text-[10px] opacity-60 tracking-wider uppercase">Bilans całkowity</div>
            <div className={`stat-value text-4xl font-display mt-2 tracking-tight ${balance >= 0 ? 'text-success' : 'text-error'}`}>
              {balance.toLocaleString()} zł
            </div>
            <div className="stat-desc mt-2 font-display opacity-40 tracking-wide text-[9px] uppercase">Dostępne środki w systemie</div>
          </div>

          <div className="stat bg-base-200/50 backdrop-blur-md border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden group hover:border-success/20 transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-success group-hover:scale-110 transition-transform duration-500">
               <ArrowUpCircle className="w-24 h-24" />
            </div>
            <div className="stat-title font-display text-[10px] opacity-60 tracking-wider uppercase">Suma przychodów</div>
            <div className="stat-value text-4xl font-display mt-2 text-success tracking-tight">{totalIncome.toLocaleString()} zł</div>
            <div className="stat-desc mt-2 font-display text-success/60 tracking-wide text-[9px] uppercase">Całkowity wpływ</div>
          </div>

          <div className="stat bg-base-200/50 backdrop-blur-md border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden group hover:border-error/20 transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-error group-hover:scale-110 transition-transform duration-500">
               <ArrowDownCircle className="w-24 h-24" />
            </div>
            <div className="stat-title font-display text-[10px] opacity-60 tracking-wider uppercase">Suma wydatków</div>
            <div className="stat-value text-4xl font-display mt-2 text-error tracking-tight">{totalExpenses.toLocaleString()} zł</div>
            <div className="stat-desc mt-2 font-display text-error/60 tracking-wide text-[9px] uppercase">Łączne koszty</div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <HustleInput type="INCOME" />
             <HustleInput type="EXPENSE" />
          </div>

          <div className="card bg-base-200/50 backdrop-blur-md border border-white/5 shadow-2xl overflow-hidden">
            <div className="card-body p-0">
              <div className="p-6 border-b border-white/5 bg-base-300/30 flex items-center justify-between">
                  <h2 className="card-title text-xl font-display text-base-content tracking-wide flex items-center gap-3">
                    <Activity className="w-5 h-5 text-primary" />
                    Ostatnie operacje
                  </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr className="bg-base-300/30 text-base-content/40 tracking-wider text-[9px] font-display border-white/5 uppercase">
                      <td className="py-6 pl-8">Opis i data</td>
                      <td className="py-6">Kategoria</td>
                      <td className="py-6">Kwota</td>
                      <td className="py-6 pr-8 text-right">Akcja</td>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses?.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-20 text-center opacity-40 font-display text-xs">Brak operacji do wyświetlenia. Wpisz coś powyżej!</td>
                      </tr>
                    ) : (
                      expenses?.map((exp) => (
                        <tr key={exp.id} className="hover:bg-white/5 transition-colors border-white/5 group">
                          <td className="py-6 pl-8">
                            <div className="font-display text-sm text-base-content group-hover:text-primary transition-colors">{exp.description}</div>
                            <div className="text-[10px] opacity-40 uppercase tracking-widest mt-1">
                              {new Date(exp.timestamp).toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                            </div>
                          </td>
                          <td className="py-6">
                            <span className="badge badge-sm font-display text-[8px] tracking-[0.2em] border-none text-white px-3 py-3" style={{backgroundColor: CATEGORY_COLORS[exp.category]}}>
                              {exp.category}
                            </span>
                          </td>
                          <td className={`py-6 font-display text-lg tracking-tight ${exp.category === ExpenseCategory.INCOME ? 'text-success' : 'text-base-content'}`}>
                            {exp.category === ExpenseCategory.INCOME ? '+' : '-'}{exp.amount.toLocaleString()} zł
                          </td>
                          <td className="py-6 pr-8 text-right">
                            <button 
                              onClick={() => deleteMutation.mutate(exp.id)}
                              className="btn btn-ghost btn-sm text-error/20 hover:text-error hover:bg-error/10 rounded-xl transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="card bg-base-200/50 backdrop-blur-md border border-white/5 shadow-2xl p-8 sticky top-8">
            <h2 className="card-title text-xl font-display text-base-content mb-8 tracking-wide flex items-center justify-between">
              Analiza struktury
              <PieChartIcon className="w-5 h-5 opacity-20" />
            </h2>
            <div className="h-[300px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name]} className="hover:opacity-80 transition-opacity cursor-pointer outline-none" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', fontSize: '10px', fontFamily: 'inherit'}}
                    itemStyle={{color: '#fff', textTransform: 'uppercase'}}
                    cursor={{fill: 'transparent'}}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[9px] font-display opacity-40 tracking-[0.3em] uppercase">Struktura</span>
                  <span className="text-2xl font-display text-primary uppercase">Flow</span>
              </div>
            </div>
            <div className="mt-8 space-y-3">
              {chartData.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group">
                  <div className="flex items-center gap-3">
                     <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]" style={{backgroundColor: CATEGORY_COLORS[item.name]}} />
                     <span className="text-[10px] font-display opacity-60 tracking-wider uppercase group-hover:opacity-100 transition-opacity">{item.name}</span>
                  </div>
                  <span className="text-xs font-display text-base-content/80">{item.value.toLocaleString()} zł</span>
                </div>
              ))}
              {chartData.length === 0 && (
                <div className="text-center py-10 opacity-20 font-display text-[10px] uppercase">Brak danych</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
