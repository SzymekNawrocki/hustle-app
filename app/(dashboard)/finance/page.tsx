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
  DollarSign
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
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
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

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Finanse</h1>
          <p className="text-gray-400 mt-2">Zarządzaj swoim portfelem i śledź aktywa.</p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl px-6 py-4 flex items-center gap-4">
          <div className="p-2 bg-blue-500 rounded-lg shadow-lg shadow-blue-500/20">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Suma zainwestowana</p>
            <p className="text-xl font-bold text-white">{totalValue.toLocaleString()} zł</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Asset Table */}
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-[#111114] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-white/5 flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-bold text-white">Moje Aktywa</h2>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01]">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Aktywo</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Ilość</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Cena śr.</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Zainwestowano</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {portfolio?.map((asset) => (
                  <tr key={asset.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-white font-medium">{asset.ticker}</span>
                        <span className="text-[10px] text-gray-500 uppercase">{asset.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-300 font-mono">
                      {asset.total_quantity.toFixed(4)}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-300 font-mono">
                      {asset.average_buy_price.toLocaleString()} zł
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-blue-400 font-bold">{asset.total_invested.toLocaleString()} zł</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {portfolio?.length === 0 && (
              <div className="py-12 text-center text-gray-500">Portfel jest pusty.</div>
            )}
          </div>
        </div>

        {/* Distribution Chart */}
        <div className="bg-[#111114] border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <PieChartIcon className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Podział portfela</h2>
          </div>
          
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#1c1c21", 
                    borderColor: "rgba(255,255,255,0.05)",
                    borderRadius: "12px",
                    color: "#fff"
                  }}
                  itemStyle={{ color: "#fff" }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: "20px" }}
                  formatter={(value) => <span className="text-xs text-gray-400 ml-1">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 pt-6 border-t border-white/5 space-y-4">
            {chartData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-gray-400">{item.name}</span>
                </div>
                <span className="text-white font-semibold">
                  {((item.value / totalValue) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
