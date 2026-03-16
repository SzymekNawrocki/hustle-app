"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { AssetType, TransactionType, AssetPortfolioResponse } from "@/types/api";
import { Plus, X, Loader2, DollarSign, TrendingUp, Briefcase } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const schema = z.object({
  ticker: z.string().min(1, "Ticker jest wymagany"),
  name: z.string().min(1, "Nazwa jest wymagana"),
  asset_type: z.nativeEnum(AssetType),
  type: z.nativeEnum(TransactionType),
  amount: z.number().min(0.000001, "Ilość musi być większa niż 0"),
  price_per_unit: z.number().min(0.01, "Cena musi być większa niż 0"),
  fee: z.number().min(0, "Prowizja nie może być ujemna"),
});

type FormData = z.infer<typeof schema>;

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingAssets: AssetPortfolioResponse[];
}

export default function AddTransactionModal({ isOpen, onClose, existingAssets }: AddTransactionModalProps) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      asset_type: AssetType.STOCK,
      type: TransactionType.BUY,
      amount: 0,
      price_per_unit: 0,
      fee: 0,
    },
  });

  const ticker = watch("ticker");

  const addMutation = useMutation({
    mutationFn: async (data: FormData) => {
      let assetId: number;
      
      const existing = existingAssets.find(a => a.ticker.toUpperCase() === data.ticker.toUpperCase());
      
      if (existing) {
        assetId = existing.id;
      } else {
        const assetRes = await api.post("/finance/assets", {
          ticker: data.ticker.toUpperCase(),
          name: data.name,
          asset_type: data.asset_type
        });
        assetId = assetRes.data.id;
      }

      await api.post("/finance/transactions", {
        type: data.type,
        amount: data.amount,
        price_per_unit: data.price_per_unit,
        fee: data.fee,
        asset_id: assetId,
        timestamp: new Date().toISOString().replace("Z", "")
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
      onClose();
      reset();
      setError(null);
    },
    onError: (err: any) => {
      setError(err.response?.data?.detail || "Wystąpił błąd podczas dodawania transakcji.");
    },
  });

  if (!isOpen) return null;

  return (
    <div className="modal modal-open font-sans">
      <div className="modal-box bg-base-200/50 backdrop-blur-xl border border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.8)] p-0 overflow-hidden max-w-lg rounded-[2.5rem]">
        <div className="h-2 bg-gradient-to-r from-primary via-secondary to-primary animate-gradient bg-[length:200%_auto]" />
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-base-300/30">
          <h3 className="text-xl font-display flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-secondary" />
            Dodaj operację
          </h3>
          <button onClick={onClose} className="btn btn-ghost btn-md btn-square rounded-2xl opacity-40 hover:opacity-100 transition-all">
            <X className="w-8 h-8" />
          </button>
        </div>

        <form onSubmit={handleSubmit((data) => addMutation.mutate(data))} className="p-8 space-y-6">
          {error && (
            <div className="alert alert-error text-[9px] font-display py-3 rounded-xl border-none shadow-lg tracking-wider">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-display text-[9px] opacity-40 tracking-wider">Ticker</span>
              </label>
              <input
                {...register("ticker")}
                placeholder="np. BTC, AAPL"
                className={`input input-bordered bg-base-100/50 border-white/5 focus:input-primary transition-all font-display text-lg py-5 rounded-2xl ${errors.ticker ? 'input-error' : ''}`}
                onChange={(e) => {
                  const val = e.target.value.toUpperCase();
                  setValue("ticker", val);
                  const existing = existingAssets.find(a => a.ticker === val);
                  if (existing) {
                    setValue("name", existing.name);
                    setValue("asset_type", existing.asset_type);
                  }
                }}
              />
              {errors.ticker && <span className="text-[10px] text-error mt-2 font-display tracking-wider">{errors.ticker.message}</span>}
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-display text-[9px] opacity-40 tracking-wider">Typ aktywa</span>
              </label>
              <select 
                {...register("asset_type")}
                className="select select-bordered bg-base-100/50 border-white/5 font-display tracking-wide h-12 rounded-2xl"
              >
                <option value={AssetType.STOCK} className="bg-base-200">Akcja</option>
                <option value={AssetType.CRYPTO} className="bg-base-200">Krypto</option>
                <option value={AssetType.CASH} className="bg-base-200">Gotówka</option>
              </select>
            </div>
          </div>

          <div className="form-control">
            <label className="label py-1">
              <span className="label-text font-display text-[9px] opacity-40 tracking-wider">Nazwa pełna</span>
            </label>
            <input
              {...register("name")}
              placeholder="np. Bitcoin, Apple Inc."
              className={`input input-bordered bg-base-100/50 border-white/5 focus:input-primary transition-all font-display tracking-tight py-5 rounded-2xl ${errors.name ? 'input-error' : ''}`}
            />
            {errors.name && <span className="text-[9px] text-error mt-2 font-display">{errors.name.message}</span>}
          </div>

          <div className="divider opacity-5 my-2" />

          <div className="grid grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-display text-[9px] opacity-40 tracking-wider">Ilość</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  {...register("amount", { valueAsNumber: true })}
                  className={`input input-bordered w-full bg-base-100/50 border-white/5 font-display text-lg py-5 rounded-2xl ${errors.amount ? 'input-error' : ''}`}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none opacity-40 font-display text-[9px] tracking-tight">
                  UNIT
                </div>
              </div>
              {errors.amount && <span className="text-[9px] text-error mt-2 font-display">{errors.amount.message}</span>}
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-display text-[9px] opacity-40 tracking-wider">Cena / jedn.</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  {...register("price_per_unit", { valueAsNumber: true })}
                  className={`input input-bordered w-full bg-base-100/50 border-white/5 font-display text-lg py-5 rounded-2xl ${errors.price_per_unit ? 'input-error' : ''}`}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none text-secondary">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              {errors.price_per_unit && <span className="text-[9px] text-error mt-2 font-display">{errors.price_per_unit.message}</span>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-display text-[9px] opacity-40 tracking-wider">Typ transakcji</span>
              </label>
              <div className="flex gap-2 p-1 bg-base-300/50 rounded-2xl border border-white/5">
                 <button 
                   type="button"
                   onClick={() => setValue("type", TransactionType.BUY)}
                   className={`flex-1 py-2 rounded-xl font-display text-[10px] transition-all ${watch("type") === TransactionType.BUY ? 'bg-primary text-white shadow-[0_0_15px_rgba(123,46,255,0.3)]' : 'opacity-20 hover:opacity-40'}`}
                 >
                   Zakup
                 </button>
                 <button 
                   type="button"
                   onClick={() => setValue("type", TransactionType.SELL)}
                   className={`flex-1 py-2 rounded-xl font-display text-[10px] transition-all ${watch("type") === TransactionType.SELL ? 'bg-secondary text-black shadow-[0_0_15px_rgba(0,212,255,0.3)]' : 'opacity-20 hover:opacity-40'}`}
                 >
                   Sprzedaż
                 </button>
              </div>
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-display text-[9px] opacity-40 tracking-wider">Prowizja</span>
              </label>
              <input
                type="number"
                step="any"
                {...register("fee", { valueAsNumber: true })}
                className="input input-bordered bg-base-100/50 border-white/5 font-display text-lg py-5 rounded-2xl"
              />
            </div>
          </div>

          <div className="pt-6 flex gap-4">
             <button 
              type="button" 
              onClick={onClose} 
              className="btn btn-ghost flex-1 font-display text-[10px] opacity-40 hover:opacity-100 transition-all rounded-2xl h-12"
             >
               Anuluj
             </button>
             <button 
              type="submit" 
              disabled={addMutation.isPending}
              className="btn btn-primary flex-[2] font-display text-lg shadow-[0_0_30px_rgba(123,46,255,0.2)] rounded-2xl h-12 transition-all hover:scale-[1.01]"
             >
               {addMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Zapisz operację"}
             </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop bg-black/80 backdrop-blur-md" onClick={onClose}></div>
    </div>
  );
}
