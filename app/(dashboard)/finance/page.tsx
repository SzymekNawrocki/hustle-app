"use client";

import { useState } from "react";
import type { Expense, ExpenseCategory } from "@/types/api";
import { usePaginatedQuery } from "@/hooks/use-paginated-query";
import { useCRUD } from "@/hooks/use-crud";
import {
  Trash2,
  Pencil,
  X,
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
import { Input } from "@/components/ui/input";
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

const LIMIT = 20;
const CATEGORIES = ["OPLATY", "HUSTLE", "LIFESTYLE", "INCOME"] as const;

export default function FinancePage() {
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editForm, setEditForm] = useState({ amount: "", category: "", description: "", date: "" });

  const { data, isLoading, page, nextPage, prevPage, hasNextPage, hasPrevPage } =
    usePaginatedQuery<Expense>("expenses", "/finance/expenses", LIMIT);

  const expenses = data?.items;

  const { remove: deleteMutation, update: editMutation } = useCRUD<Expense>(
    "/finance/expenses",
    "expenses",
    { extraInvalidations: [["dashboard-today"]] }
  );

  const openEdit = (exp: Expense) => {
    setEditingExpense(exp);
    setEditForm({
      amount: exp.amount.toString(),
      category: exp.category,
      description: exp.description,
      date: (exp.timestamp ?? "").split("T")[0],
    });
  };

  const submitEdit = () => {
    if (!editingExpense) return;
    const amount = parseFloat(editForm.amount);
    if (isNaN(amount) || amount <= 0) return;
    editMutation.mutate(
      {
        id: editingExpense.id,
        payload: {
          amount,
          category: editForm.category as ExpenseCategory,
          description: editForm.description,
          timestamp: `${editForm.date}T00:00:00`,
        },
      },
      { onSuccess: () => setEditingExpense(null) }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-10 font-sans pb-20">
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

  const totalIncome = expenses?.filter(e => e.category === "INCOME").reduce((acc, e) => acc + e.amount, 0) || 0;
  const totalExpenses = expenses?.filter(e => e.category !== "INCOME").reduce((acc, e) => acc + e.amount, 0) || 0;
  const balance = totalIncome - totalExpenses;

  const chartData = Object.keys(CATEGORY_COLORS).map(cat => ({
    name: cat,
    value: expenses?.filter(e => e.category === cat).reduce((acc, e) => acc + e.amount, 0) || 0
  })).filter(d => d.value > 0);

  return (
    <div className="space-y-10 font-sans pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-5xl font-display text-foreground tracking-tight border-l-4 border-primary pl-4 uppercase">Finance Flow</h1>
          <p className="text-muted-foreground mt-2 font-display tracking-wide text-xs uppercase opacity-60">Manage your money across 3 buckets</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-card/60 backdrop-blur-md border border-border/60 rounded-3xl shadow-2xl relative overflow-hidden group">
            <CardContent className="p-8">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-">
                <Wallet className="w-24 h-24" />
              </div>
              <div className="font-display text-xs opacity-60 tracking-wide uppercase">Total balance</div>
              <div className={`text-4xl font-display mt-2 tracking-tight ${balance >= 0 ? 'text-emerald-400' : 'text-destructive'}`}>
                {balance.toLocaleString()} PLN
              </div>
              <div className="mt-2 font-display opacity-50 tracking-wide text-xs uppercase">Available funds</div>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-md border border-border/60 rounded-3xl shadow-2xl relative overflow-hidden group hover:border-emerald-500/30">
            <CardContent className="p-8">
              <div className="absolute top-0 right-0 p-4 opacity-5 text-emerald-400 group-">
                <ArrowUpCircle className="w-24 h-24" />
              </div>
              <div className="font-display text-xs opacity-60 tracking-wide uppercase">Total income</div>
              <div className="text-4xl font-display mt-2 text-emerald-400 tracking-tight">{totalIncome.toLocaleString()} PLN</div>
              <div className="mt-2 font-display text-emerald-300/70 tracking-wide text-xs uppercase">Total inflow</div>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-md border border-border/60 rounded-3xl shadow-2xl relative overflow-hidden group hover:border-destructive/30">
            <CardContent className="p-8">
              <div className="absolute top-0 right-0 p-4 opacity-5 text-destructive group-">
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
                        <TableRow key={exp.id} className="hover:bg-accent/20 border-border/60 group">
                          <TableCell className="py-6 pl-8 align-top whitespace-normal">
                            <div className="font-display text-sm text-foreground">
                              {exp.description}
                            </div>
                            <div className="text-xs opacity-40 uppercase tracking-wider mt-1">
                              {new Date(exp.timestamp ?? "").toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' })}
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
                          <TableCell className={`py-6 font-display text-lg tracking-tight ${exp.category === "INCOME" ? 'text-emerald-400' : 'text-foreground'}`}>
                            {exp.category === "INCOME" ? '+' : '-'}{exp.amount.toLocaleString()} PLN
                          </TableCell>
                          <TableCell className="py-6 pr-8 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                onClick={() => openEdit(exp)}
                                variant="ghost"
                                size="icon-sm"
                                className="opacity-40 hover:text-primary rounded-xl"
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                onClick={() => deleteMutation.mutate(exp.id)}
                                variant="ghost"
                                size="icon-sm"
                                className="text-destructive/60 hover:text-destructive hover:bg-destructive/10 rounded-xl"
                                disabled={deleteMutation.isPending}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
            </CardContent>
          </Card>

          {data && data.pages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={prevPage}
                disabled={!hasPrevPage}
                className="font-display tracking-wide text-xs"
              >
                ← Prev
              </Button>
              <span className="text-xs font-display opacity-40 tracking-wide">
                {page} / {data.pages} &nbsp;·&nbsp; {data.total} transactions
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={nextPage}
                disabled={!hasNextPage}
                className="font-display tracking-wide text-xs"
              >
                Next →
              </Button>
            </div>
          )}
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
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name]} className=" cursor-pointer outline-none" />
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
                <div key={i} className="flex items-center justify-between p-4 bg-accent/20 rounded-2xl border border-border/60 group">
                  <div className="flex items-center gap-3">
                     <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]" style={{backgroundColor: CATEGORY_COLORS[item.name]}} />
                     <span className="text-xs font-display opacity-60 tracking-wide uppercase group-">{item.name}</span>
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

      {/* Edit transaction modal */}
      {editingExpense && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setEditingExpense(null)}
        >
          <Card
            className="w-full max-w-md mx-4 bg-card border border-border/60 shadow-2xl rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-display tracking-tight">Edit transaction</h2>
                <Button variant="ghost" size="icon" onClick={() => setEditingExpense(null)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <label className="block space-y-2">
                <span className="font-display text-xs opacity-50 tracking-wide uppercase">Amount (PLN)</span>
                <Input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={editForm.amount}
                  onChange={(e) => setEditForm((f) => ({ ...f, amount: e.target.value }))}
                  className="bg-background/40 border-border/60 rounded-2xl h-12"
                />
              </label>

              <label className="block space-y-2">
                <span className="font-display text-xs opacity-50 tracking-wide uppercase">Category</span>
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm((f) => ({ ...f, category: e.target.value }))}
                  className="flex h-12 w-full rounded-2xl border border-border/60 bg-background/40 px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-popover">
                      {cat}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block space-y-2">
                <span className="font-display text-xs opacity-50 tracking-wide uppercase">Description</span>
                <Input
                  type="text"
                  value={editForm.description}
                  onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                  className="bg-background/40 border-border/60 rounded-2xl h-12"
                />
              </label>

              <label className="block space-y-2">
                <span className="font-display text-xs opacity-50 tracking-wide uppercase">Date</span>
                <Input
                  type="date"
                  value={editForm.date}
                  onChange={(e) => setEditForm((f) => ({ ...f, date: e.target.value }))}
                  className="bg-background/40 border-border/60 rounded-2xl h-12"
                />
              </label>

              {editMutation.isError && (
                <p className="text-xs text-destructive font-display tracking-wide">
                  {(editMutation.error as { response?: { data?: { detail?: string } } })?.response?.data?.detail ?? "Failed to save changes."}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 font-display tracking-wide"
                  onClick={() => setEditingExpense(null)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 font-display tracking-wide shadow-[0_0_20px_rgba(123,46,255,0.3)]"
                  onClick={submitEdit}
                  disabled={editMutation.isPending || !editForm.amount || !editForm.description || !editForm.date}
                >
                  {editMutation.isPending ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
