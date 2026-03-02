"use client";

import { useState, useTransition } from "react";
import { Trash2, ExternalLink } from "lucide-react";
import { deleteOffer, updateOfferStatus } from "@/app/(dashboard)/career/actions";
import type { JobOffer } from "@/types/api";

const STATUSES = ["wysłano", "1 etap", "2 etap", "3 etap", "umowa"] as const;

export default function OfferList({ offers }: { offers: JobOffer[] }) {
  const [isPending, startTransition] = useTransition();
  const [pendingOfferId, setPendingOfferId] = useState<number | null>(null);

  return (
    <div className="card bg-base-200 border border-base-300 shadow-xl overflow-hidden">
      <div className="card-body p-0">
        <div className="p-6 border-b border-base-300 flex items-center justify-between">
          <h2 className="card-title text-xl font-bold">Oferty</h2>
          <div className="badge badge-primary badge-outline font-bold">{offers.length}</div>
        </div>

        <div className="divide-y divide-base-300">
          {offers.length === 0 && (
            <div className="p-8 text-center opacity-60 font-medium">
              Brak ofert. Dodaj pierwszą.
            </div>
          )}

          {offers.map((offer) => (
            <div key={offer.id} className="p-6 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="font-bold text-base truncate">
                  {offer.title}
                  {offer.company ? <span className="opacity-60 font-medium"> {`• ${offer.company}`}</span> : null}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="badge badge-secondary badge-outline font-bold">{offer.status}</span>
                  <select
                    name="status"
                    defaultValue={offer.status}
                    className="select select-bordered select-xs"
                    disabled={isPending && pendingOfferId === offer.id}
                    onChange={(e) => {
                      const nextStatus = e.target.value;
                      const fd = new FormData();
                      fd.set("status", nextStatus);
                      setPendingOfferId(offer.id);
                      startTransition(async () => {
                        try {
                          await updateOfferStatus(offer.id, fd);
                        } finally {
                          setPendingOfferId(null);
                        }
                      });
                    }}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <a
                    href={offer.url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-ghost btn-xs gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Link
                  </a>
                </div>
              </div>

              <form action={deleteOffer.bind(null, offer.id)}>
                <button className="btn btn-ghost btn-sm text-error hover:bg-error/10" type="submit">
                  <Trash2 className="w-4 h-4" />
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
