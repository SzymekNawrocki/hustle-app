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
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        await createOffer({ title, company: company.trim() ? company.trim() : undefined, status, url });
        setTitle("");
        setCompany("");
        setStatus("wysłano");
        setUrl("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Nie udało się dodać oferty");
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="card bg-base-200 border border-base-300 shadow-xl">
      <div className="card-body gap-4">
        <h2 className="card-title text-xl font-bold">Dodaj ofertę</h2>

        <label className="form-control">
          <div className="label">
            <span className="label-text font-bold">Stanowisko</span>
          </div>
          <input
            className="input input-bordered"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Np. Frontend Developer"
            required
          />
        </label>

        <label className="form-control">
          <div className="label">
            <span className="label-text font-bold">Firma</span>
          </div>
          <input
            className="input input-bordered"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Np. Acme"
          />
        </label>

        <label className="form-control">
          <div className="label">
            <span className="label-text font-bold">Status</span>
          </div>
          <select
            className="select select-bordered"
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <label className="form-control">
          <div className="label">
            <span className="label-text font-bold">Link</span>
          </div>
          <input
            className="input input-bordered"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            required
          />
        </label>

        {error && <div className="alert alert-error text-sm">{error}</div>}

        <button className="btn btn-primary" disabled={isPending} type="submit">
          {isPending ? "Dodawanie..." : "Dodaj"}
        </button>
      </div>
    </form>
  );
}
