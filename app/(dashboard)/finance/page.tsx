"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { AssetPortfolioResponse, AssetType } from "@/types/api";
import { 
  Loader2, 
  Wallet, 
  TrendingUp, 
  PieChart as PieChartIcon,
  ArrowUpRight,
  DollarSign,
  Briefcase,
  Trash2
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  Legend
} from "recharts";
import AddTransactionModal from "@/components/finance/AddTransactionModal";
import { useState } from "react";

const COLORS = ["#7B2EFF", "#00D4FF", "#9152ff", "#33dcff", "#6366f1"];

export default function FinancePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data: portfolio, isLoading } = useQuery<AssetPortfolioResponse[]>({
    queryKey: ["portfolio"],
    queryFn: async () => {
      const response = await api.get("/finance/portfolio");
      return response.data;
    },
  });

  const deleteAssetMutation = useMutation({
    mutationFn: async (assetId: number) => {
      await api.delete(`/finance/assets/${assetId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
    },
    onError: (err) => {
      console.error("Failed to delete asset:", err);
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="loading loading-ring loading-lg text-primary"></span>
      </div>
    );
  }

  const totalValue = portfolio?.reduce((acc, asset) => acc + asset.total_invested, 0) || 0;

  const chartData = portfolio?.reduce((acc: any[], asset) => {
    const existing = acc.find((item) => item.name === asset.asset_type);
    if (existing) {
      existing.value += asset.total_invested;
    } else {
      acc.push({ name: asset.asset_type, value: asset.total_invested });
    }
    return acc;
  }, []) || [];

  // No longer using hardcoded assetData


  return (
    <div className="space-y-10 animate-in fade-in duration-700 font-sans">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl lg:text-5xl font-display text-base-content tracking-tight border-l-4 border-primary pl-4">Finanse</h1>
          <p className="text-base-content/60 mt-2 font-display tracking-wide text-[9px]">Planuj, oszczędzaj i śledź swój wzrost majątku.</p>
        </div>
        <div className="flex items-center gap-2">
           <button 
             onClick={() => setIsModalOpen(true)}
             className="btn btn-primary btn-md px-8 font-display text-lg tracking-wide shadow-[0_0_20px_rgba(123,46,255,0.2)] transition-all hover:scale-[1.02]"
           >
             Dodaj transakcję
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10 text-left">
          <div className="stat bg-base-200/50 backdrop-blur-md border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
               <TrendingUp className="w-24 h-24" />
            </div>
            <div className="stat-title font-display text-[10px] opacity-60 tracking-wider">Suma zainwestowana</div>
            <div className="stat-value text-4xl font-display mt-2 text-primary tracking-tight">{totalValue.toLocaleString()} zł</div>
            <div className="stat-desc mt-2 font-display text-secondary tracking-wide text-[9px]">RAZEM W PORTFELU</div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
        <div className="lg:col-span-2 card bg-base-200/50 backdrop-blur-md border border-white/5 shadow-2xl overflow-hidden">
          <div className="card-body p-0">
            <div className="p-6 border-b border-white/5 bg-base-300/30 flex items-center justify-between">
                <h2 className="card-title text-xl font-display text-base-content tracking-wide">Moje aktywa</h2>
                <div className="badge badge-primary font-display px-4 py-3">Wszystkie</div>
            </div>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr className="bg-base-300/30 text-base-content/40 tracking-wider text-[9px] font-display border-white/5">
                    <td className="py-6 pl-8">Aktywo</td>
                    <td className="py-6">Wartość</td>
                    <td className="py-6">Udział</td>
                    <td className="py-6 pr-8 text-right">Usuń</td>
                  </tr>
                </thead>
                <tbody>
                   {(portfolio || []).map((asset, i) => (
                    <tr key={i} className="hover:bg-primary/5 transition-colors group border-white/5 font-sans">
                      <td className="py-6 pl-8">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl bg-base-300 flex items-center justify-center p-2 shadow-inner border border-white/5`}>
                            <Briefcase className={`w-6 h-6 text-primary`} />
                          </div>
                          <div>
                            <div className="font-display text-lg text-base-content tracking-tight">{asset.ticker}</div>
                            <span className="text-[9px] opacity-40 font-display tracking-wider">{asset.name}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 font-display text-xl tracking-tight text-secondary">{asset.total_invested.toLocaleString()} zł</td>
                      <td className="py-6 font-display opacity-60">
                        {((asset.total_invested / totalValue) * 100).toFixed(1)}%
                      </td>
                      <td className="py-6 pr-8 text-right">
                        <button
                          onClick={() => deleteAssetMutation.mutate(asset.id)}
                          className="btn btn-ghost btn-sm text-error/20 hover:text-error hover:bg-error/10 transition-all rounded-xl"
                          disabled={deleteAssetMutation.isPending}
                        >
                          {deleteAssetMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-5 h-5" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="card bg-base-200/50 backdrop-blur-md border border-white/5 shadow-2xl overflow-hidden">
          <div className="card-body p-8">
              <h2 className="card-title text-xl font-display text-base-content mb-8 tracking-wide">Podział portfela</h2>
              <div className="h-[280px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                     <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {chartData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{backgroundColor: '#1A1A1A', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', color: '#EDEDED'}}
                        itemStyle={{fontSize: '10px', fontWeight: 'normal', textTransform: 'none'}}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[9px] font-display opacity-40 tracking-widest">Majątek</span>
                    <span className="text-3xl font-display text-primary">TOTAL</span>
                </div>
              </div>
              <div className="mt-8 space-y-4 font-display">
                {chartData.map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-base-300/30 rounded-2xl border border-white/5 hover:bg-base-300/50 transition-all">
                    <div className="flex items-center gap-3">
                       <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}} />
                       <span className="text-[10px] tracking-wide opacity-60">{item.name}</span>
                    </div>
                    <span className="text-xs text-secondary">{((item.value / totalValue) * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
          </div>
        </div>
      </div>
      
      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        existingAssets={portfolio || []}
      />
    </div>
  );
}
