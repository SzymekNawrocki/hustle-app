"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { AssetPortfolioResponse, AssetType } from "@/types/api";
import { 
  Loader2, 
  Wallet, 
  TrendingUp, 
  PieChart as PieChartIcon,
  ArrowUpRight,
  DollarSign,
  Briefcase
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  Legend
} from "recharts";

const COLORS = ["#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

export default function FinancePage() {
  const { data: portfolio, isLoading } = useQuery<AssetPortfolioResponse[]>({
    queryKey: ["portfolio"],
    queryFn: async () => {
      const response = await api.get("/finance/portfolio");
      return response.data;
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

  // Placeholder for assetData, assuming it's derived from portfolio or a similar structure
  // For the purpose of this edit, we'll use a simplified version or map from chartData if applicable.
  // The provided code edit uses hardcoded data for assetData, so we'll use that for consistency with the edit.
  const assetData = [
    { name: 'Stocks', value: 400 },
    { name: 'Bonds', value: 300 },
    { name: 'Real Estate', value: 300 },
    { name: 'Cash', value: 200 },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-bold text-base-content tracking-tight">Finanse</h1>
          <p className="text-base-content/60 mt-2 font-medium">Planuj, oszczędzaj i śledź swój wzrost majątku.</p>
        </div>
        <div className="flex items-center gap-2">
           <button className="btn btn-primary btn-sm px-6 font-bold shadow-lg">Dodaj transakcję</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10 text-left">
          <div className="stat bg-base-200 border border-base-300 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
               <TrendingUp className="w-16 h-16" />
            </div>
            <div className="stat-title font-bold text-xs opacity-60">Suma zainwestowana</div>
            <div className="stat-value text-3xl font-bold mt-2 text-primary">124,500 zł</div>
            <div className="stat-desc mt-2 font-semibold text-success flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +12.5% od zeszłego m-ca
            </div>
          </div>
          {/* ... other stats could go here ... */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
        <div className="lg:col-span-2 card bg-base-200 border border-base-300 shadow-xl overflow-hidden">
          <div className="card-body p-0">
            <div className="p-6 border-b border-base-300 bg-base-200/30 flex items-center justify-between">
                <h2 className="card-title text-xl font-bold text-base-content">Moje Aktywa</h2>
                <div className="badge badge-primary font-bold px-4 py-3">Wszystkie</div>
            </div>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr className="bg-base-300/30 text-base-content/70 tracking-wide text-xs">
                    <td className="font-bold py-6 pl-8">Aktywo</td>
                    <td className="font-bold py-6">Wartość</td>
                    <td className="font-bold py-6">Zmiana %</td>
                    <td className="font-bold py-6 pr-8 text-right">Wykres</td>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Bitcoin', ticker: 'BTC', value: '64,200 zł', change: '+5.2', color: 'text-warning' },
                    { name: 'S&P 500 ETF', ticker: 'VUSA', value: '42,100 zł', change: '+1.4', color: 'text-primary' },
                    { name: 'Gold', ticker: 'GOLD', value: '18,200 zł', change: '-0.8', color: 'text-secondary' },
                  ].map((asset, i) => (
                    <tr key={i} className="hover:bg-base-100/50 transition-colors group">
                      <td className="py-6 pl-8">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl bg-base-300 flex items-center justify-center p-2`}>
                            <Briefcase className={`w-5 h-5 ${asset.color}`} />
                          </div>
                          <div>
                            <div className="font-bold text-base-content">{asset.ticker}</div>
                            <span className="text-[10px] opacity-60 font-bold">{asset.name}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 font-bold">{asset.value}</td>
                      <td className={`py-6 font-bold ${asset.change.startsWith('+') ? 'text-success' : 'text-error'}`}>
                        {asset.change}%
                      </td>
                      <td className="py-6 pr-8 text-right">
                         <div className="w-16 h-8 ml-auto bg-base-300/20 rounded-lg animate-pulse" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="card bg-base-200 border border-base-300 shadow-xl overflow-hidden">
          <div className="card-body p-6">
              <h2 className="card-title text-xl font-bold text-base-content mb-6">Podział portfela</h2>
              <div className="h-[250px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={assetData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {assetData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{backgroundColor: '#141414', border: '1px solid #333', borderRadius: '12px'}}
                        itemStyle={{fontSize: '10px', color: '#fff'}}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[10px] font-bold opacity-40">Razem</span>
                    <span className="text-xl font-bold">124.5k</span>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                {assetData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-2 hover:bg-base-100 rounded-xl transition-colors">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}} />
                       <span className="text-xs font-bold opacity-70">{item.name}</span>
                    </div>
                    <span className="text-xs font-bold">{item.value}%</span>
                  </div>
                ))}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
