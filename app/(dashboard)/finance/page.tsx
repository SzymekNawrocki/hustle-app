"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Expense, ExpenseCategory } from "@/types/api";
import { 
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

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
      <div className="space-y-10 animate-in fade-in duration-700 font-sans pb-20">
        <div className="space-y-3">
          <Skeleton className="h-10 w-[260px]" />
          <Skeleton className="h-4 w-[320px]" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-40 rounded-3xl" />
          <Skeleton className="h-40 rounded-3xl" />
          <Skeleton className="h-40 rounded-3xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-56 rounded-3xl" />
              <Skeleton className="h-56 rounded-3xl" />
            </div>
            <Skeleton className="h-[520px] rounded-3xl" />
          </div>
          <Skeleton className="h-[720px] rounded-3xl" />
        </div>
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
          <h1 className="text-3xl lg:text-5xl font-display text-foreground tracking-tight border-l-4 border-primary pl-4 uppercase">Finance Flow</h1>
          <p className="text-muted-foreground mt-2 font-display tracking-wide text-xs uppercase opacity-60">Manage your money across 3 buckets</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-card/60 backdrop-blur-md border border-border/60 rounded-3xl shadow-2xl relative overflow-hidden group hover:border-primary/30 transition-all">
            <CardContent className="p-8">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
                <Wallet className="w-24 h-24" />
              </div>
              <div className="font-display text-xs opacity-60 tracking-wide uppercase">Total balance</div>
              <div className={`text-4xl font-display mt-2 tracking-tight ${balance >= 0 ? 'text-emerald-400' : 'text-destructive'}`}>
                {balance.toLocaleString()} PLN
              </div>
              <div className="mt-2 font-display opacity-50 tracking-wide text-xs uppercase">Available funds</div>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-md border border-border/60 rounded-3xl shadow-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-all">
            <CardContent className="p-8">
              <div className="absolute top-0 right-0 p-4 opacity-5 text-emerald-400 group-hover:scale-110 transition-transform duration-500">
                <ArrowUpCircle className="w-24 h-24" />
              </div>
              <div className="font-display text-xs opacity-60 tracking-wide uppercase">Total income</div>
              <div className="text-4xl font-display mt-2 text-emerald-400 tracking-tight">{totalIncome.toLocaleString()} PLN</div>
              <div className="mt-2 font-display text-emerald-300/70 tracking-wide text-xs uppercase">Total inflow</div>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-md border border-border/60 rounded-3xl shadow-2xl relative overflow-hidden group hover:border-destructive/30 transition-all">
            <CardContent className="p-8">
              <div className="absolute top-0 right-0 p-4 opacity-5 text-destructive group-hover:scale-110 transition-transform duration-500">
                <ArrowDownCircle className="w-24 h-24" />
              </div>
              <div className="font-display text-xs opacity-60 tracking-wide uppercase">Total expenses</div>
              <div className="text-4xl font-display mt-2 text-destructive tracking-tight">{totalExpenses.toLocaleString()} PLN</div>
              <div className="mt-2 font-display text-destructive/70 tracking-wide text-xs uppercase">Total cost</div>
            </CardContent>
          </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <HustleInput type="INCOME" />
             <HustleInput type="EXPENSE" />
          </div>

          <Card className="bg-card/60 backdrop-blur-md border border-border/60 shadow-2xl overflow-hidden">
            <CardHeader className="p-6 border-b border-border/60 bg-muted/30 flex flex-row items-center justify-between">
                  <CardTitle className="text-xl font-display text-foreground tracking-wide flex items-center gap-3">
                    <Activity className="w-5 h-5 text-primary" />
                    Recent transactions
                  </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 text-muted-foreground tracking-wide text-xs font-display border-border/60 uppercase hover:bg-muted/30">
                      <TableHead className="py-6 pl-8">Description & date</TableHead>
                      <TableHead className="py-6">Category</TableHead>
                      <TableHead className="py-6">Amount</TableHead>
                      <TableHead className="py-6 pr-8 text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="py-20 text-center opacity-40 font-display text-xs">
                          No transactions to display. Add one above!
                        </TableCell>
                      </TableRow>
                    ) : (
                      expenses?.map((exp) => (
                        <TableRow key={exp.id} className="hover:bg-accent/20 transition-colors border-border/60 group">
                          <TableCell className="py-6 pl-8 align-top whitespace-normal">
                            <div className="font-display text-sm text-foreground group-hover:text-primary transition-colors">
                              {exp.description}
                            </div>
                            <div className="text-xs opacity-40 uppercase tracking-wider mt-1">
                              {new Date(exp.timestamp).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                            </div>
                          </TableCell>
                          <TableCell className="py-6">
                            <Badge
                              className="font-display text-xs tracking-wide border-none text-white px-3 py-2.5"
                              style={{ backgroundColor: CATEGORY_COLORS[exp.category] }}
                            >
                              {exp.category}
                            </Badge>
                          </TableCell>
                          <TableCell className={`py-6 font-display text-lg tracking-tight ${exp.category === ExpenseCategory.INCOME ? 'text-emerald-400' : 'text-foreground'}`}>
                            {exp.category === ExpenseCategory.INCOME ? '+' : '-'}{exp.amount.toLocaleString()} PLN
                          </TableCell>
                          <TableCell className="py-6 pr-8 text-right">
                            <Button
                              onClick={() => deleteMutation.mutate(exp.id)}
                              variant="ghost"
                              size="icon-sm"
                              className="text-destructive/60 hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="bg-card/60 backdrop-blur-md border border-border/60 shadow-2xl p-8 sticky top-8">
            <CardTitle className="text-xl font-display text-foreground mb-8 tracking-wide flex items-center justify-between">
              Breakdown
              <PieChartIcon className="w-5 h-5 opacity-20" />
            </CardTitle>
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
                  <span className="text-xs font-display opacity-40 tracking-widest uppercase">Breakdown</span>
                  <span className="text-2xl font-display text-primary uppercase">Flow</span>
              </div>
            </div>
            <div className="mt-8 space-y-3">
              {chartData.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-accent/20 rounded-2xl border border-border/60 hover:bg-accent/30 transition-all group">
                  <div className="flex items-center gap-3">
                     <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]" style={{backgroundColor: CATEGORY_COLORS[item.name]}} />
                     <span className="text-xs font-display opacity-60 tracking-wide uppercase group-hover:opacity-100 transition-opacity">{item.name}</span>
                  </div>
                  <span className="text-xs font-display text-muted-foreground">{item.value.toLocaleString()} PLN</span>
                </div>
              ))}
              {chartData.length === 0 && (
                <div className="text-center py-10 opacity-20 font-display text-xs uppercase">No data</div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
