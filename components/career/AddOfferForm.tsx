"use client";

import { useState, useTransition } from "react";
import { createOffer } from "@/app/(dashboard)/career/actions";

const STATUSES = ["wysłano", "1 etap", "2 etap", "3 etap", "umowa"] as const;

export default function AddOfferForm() {
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("wysłano");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        await createOffer({ title, company: company.trim() ? company.trim() : undefined, status, url, notes: notes.trim() ? notes.trim() : undefined });
        setTitle("");
        setCompany("");
        setStatus("wysłano");
        setUrl("");
        setNotes("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Nie udało się dodać oferty");
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="card bg-base-200/50 backdrop-blur-md border border-white/5 shadow-2xl overflow-hidden font-sans">
      <div className="h-1.5 bg-gradient-to-r from-primary via-secondary to-primary animate-gradient bg-[length:200%_auto]" />
      <div className="card-body p-8 gap-6">
        <h2 className="card-title text-2xl font-display text-base-content tracking-tight">Dodaj ofertę</h2>

        <label className="form-control">
          <div className="label">
            <span className="label-text-alt font-display opacity-40 tracking-wider text-[9px]">Stanowisko</span>
          </div>
          <input
            className="input input-bordered bg-base-100/50 border-white/5 focus:input-primary transition-all py-6"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Np. Frontend Developer"
            required
          />
        </label>

        <label className="form-control">
          <div className="label">
            <span className="label-text-alt font-display opacity-40 tracking-wider text-[9px]">Firma</span>
          </div>
          <input
            className="input input-bordered bg-base-100/50 border-white/5 focus:input-primary transition-all py-6"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Np. Acme"
          />
        </label>

        <label className="form-control">
          <div className="label">
            <span className="label-text-alt font-display opacity-40 tracking-wider text-[9px]">Status</span>
          </div>
          <select
            className="select select-bordered bg-base-100/50 border-white/5 focus:select-primary transition-all"
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s} className="bg-base-200">
                {s}
              </option>
            ))}
          </select>
        </label>

        <label className="form-control">
          <div className="label">
            <span className="label-text-alt font-display opacity-40 tracking-wider text-[9px]">Link</span>
          </div>
          <input
            className="input input-bordered bg-base-100/50 border-white/5 focus:input-primary transition-all py-6"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            required
          />
        </label>

        <label className="form-control">
          <div className="label">
            <span className="label-text-alt font-display opacity-40 tracking-wider text-[9px]">Notatki</span>
          </div>
          <textarea
            className="textarea textarea-bordered bg-base-100/50 border-white/5 focus:textarea-primary transition-all h-24 resize-none"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Dodatkowe informacje o ofercie..."
          />
        </label>

        {error && (
          <div className="alert alert-error rounded-xl border-none text-[9px] font-display py-3 tracking-wider">
            {error}
          </div>
        )}

        <button 
          className="btn btn-primary btn-lg font-display text-lg tracking-wide shadow-[0_0_20px_rgba(123,46,255,0.4)] transition-all hover:scale-[1.02] mt-4" 
          disabled={isPending} 
          type="submit"
        >
          {isPending ? "Dodawanie..." : "Dodaj"}
        </button>
      </div>
    </form>
  );
}
