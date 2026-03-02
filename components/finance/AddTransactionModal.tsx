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
      
      // Check if asset exists
      const existing = existingAssets.find(a => a.ticker.toUpperCase() === data.ticker.toUpperCase());
      
      if (existing) {
        assetId = existing.id;
      } else {
        // Create asset
        const assetRes = await api.post("/finance/assets", {
          ticker: data.ticker.toUpperCase(),
          name: data.name,
          asset_type: data.asset_type
        });
        assetId = assetRes.data.id;
      }

      // Create transaction
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
    <div className="modal modal-open">
      <div className="modal-box bg-base-200 border border-base-300 shadow-2xl p-0 overflow-hidden max-w-lg">
        <div className="p-6 border-b border-base-300 flex items-center justify-between bg-base-300/20">
          <h3 className="font-bold text-xl flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Dodaj transakcję
          </h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-square">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit((data) => addMutation.mutate(data))} className="p-6 space-y-4">
          {error && (
            <div className="alert alert-error text-xs font-bold py-2 rounded-xl">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-bold text-xs opacity-60">Ticker</span>
              </label>
              <input
                {...register("ticker")}
                placeholder="np. BTC, AAPL"
                className={`input input-bordered bg-base-100 focus:input-primary transition-all font-bold ${errors.ticker ? 'input-error' : ''}`}
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
              {errors.ticker && <span className="text-[10px] text-error mt-1 font-bold">{errors.ticker.message}</span>}
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-bold text-xs opacity-60">Typ aktywa</span>
              </label>
              <select 
                {...register("asset_type")}
                className="select select-bordered bg-base-100 font-bold"
              >
                <option value={AssetType.STOCK}>Akcja (Stock)</option>
                <option value={AssetType.CRYPTO}>Kryptowaluta</option>
                <option value={AssetType.CASH}>Gotówka</option>
              </select>
            </div>
          </div>

          <div className="form-control">
            <label className="label py-1">
              <span className="label-text font-bold text-xs opacity-60">Nazwa pełna</span>
            </label>
            <input
              {...register("name")}
              placeholder="np. Bitcoin, Apple Inc."
              className={`input input-bordered bg-base-100 focus:input-primary transition-all font-medium ${errors.name ? 'input-error' : ''}`}
            />
            {errors.name && <span className="text-[10px] text-error mt-1 font-bold">{errors.name.message}</span>}
          </div>

          <div className="divider opacity-10 my-0" />

          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-bold text-xs opacity-60">Ilość</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  {...register("amount", { valueAsNumber: true })}
                  className={`input input-bordered w-full bg-base-100 font-bold pr-12 ${errors.amount ? 'input-error' : ''}`}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none opacity-40 font-bold text-xs">
                  UNIT
                </div>
              </div>
              {errors.amount && <span className="text-[10px] text-error mt-1 font-bold">{errors.amount.message}</span>}
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-bold text-xs opacity-60">Cena / jedn.</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  {...register("price_per_unit", { valueAsNumber: true })}
                  className={`input input-bordered w-full bg-base-100 font-bold pr-8 ${errors.price_per_unit ? 'input-error' : ''}`}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none opacity-40">
                  <DollarSign className="w-3 h-3" />
                </div>
              </div>
              {errors.price_per_unit && <span className="text-[10px] text-error mt-1 font-bold">{errors.price_per_unit.message}</span>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-bold text-xs opacity-60">Typ transakcji</span>
              </label>
              <div className="flex gap-2 p-1 bg-base-300 rounded-xl">
                 <button 
                   type="button"
                   onClick={() => setValue("type", TransactionType.BUY)}
                   className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${watch("type") === TransactionType.BUY ? 'bg-success text-success-content' : 'opacity-40'}`}
                 >
                   ZAKUP
                 </button>
                 <button 
                   type="button"
                   onClick={() => setValue("type", TransactionType.SELL)}
                   className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${watch("type") === TransactionType.SELL ? 'bg-error text-error-content' : 'opacity-40'}`}
                 >
                   SPRZEDAŻ
                 </button>
              </div>
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-bold text-xs opacity-60">Prowizja</span>
              </label>
              <input
                type="number"
                step="any"
                {...register("fee", { valueAsNumber: true })}
                className="input input-bordered bg-base-100 font-bold"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
             <button 
              type="button" 
              onClick={onClose} 
              className="btn btn-ghost flex-1 font-bold"
             >
               Anuluj
             </button>
             <button 
              type="submit" 
              disabled={addMutation.isPending}
              className="btn btn-primary flex-[2] font-bold shadow-lg"
             >
               {addMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Zapisz transakcję"}
             </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
    </div>
  );
}
