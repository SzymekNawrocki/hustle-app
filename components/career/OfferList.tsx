"use client";

import { useState, useTransition } from "react";
import { Trash2, ExternalLink } from "lucide-react";
import { deleteOffer, updateOfferStatus, updateOfferNotes } from "@/app/(dashboard)/career/actions";
import type { JobOffer } from "@/types/api";

const STATUSES = ["wysłano", "1 etap", "2 etap", "3 etap", "umowa"] as const;

export default function OfferList({ offers }: { offers: JobOffer[] }) {
  const [isPending, startTransition] = useTransition();
  const [pendingOfferId, setPendingOfferId] = useState<number | null>(null);
  const [editingNotesId, setEditingNotesId] = useState<number | null>(null);
  const [tempNotes, setTempNotes] = useState("");

  return (
    <div className="card bg-base-200/50 backdrop-blur-md border border-white/5 shadow-2xl overflow-hidden font-sans">
      <div className="card-body p-0">
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-base-300/30">
          <h2 className="card-title text-2xl font-display text-base-content tracking-tight">Oferty</h2>
          <div className="badge badge-primary font-display px-4 py-3">{offers.length}</div>
        </div>

        <div className="divide-y divide-white/5">
          {offers.length === 0 && (
            <div className="p-16 text-center opacity-40 font-display text-xl tracking-wide">
              Brak ofert. Dodaj pierwszą.
            </div>
          )}

          {offers.map((offer) => (
            <div key={offer.id} className="p-8 flex flex-col sm:flex-row sm:items-center gap-6 hover:bg-primary/5 transition-all">
              <div className="flex-1 min-w-0">
                <div className="font-display text-2xl text-base-content tracking-tight truncate">
                  {offer.title}
                  {offer.company ? <span className="text-secondary opacity-60"> {` @ ${offer.company}`}</span> : null}
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <span className="badge badge-secondary font-display text-[10px] py-4 px-4 tracking-wider">{offer.status}</span>
                  <select
                    name="status"
                    defaultValue={offer.status}
                    className="select select-bordered select-xs bg-base-300/50 border-white/5 font-display tracking-wide h-8"
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
                      <option key={s} value={s} className="bg-base-200">
                        {s}
                      </option>
                    ))}
                  </select>
                  <a
                    href={offer.url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-ghost btn-xs gap-2 font-display tracking-wider opacity-60 hover:opacity-100 hover:text-primary transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Link
                  </a>
                  <button
                    onClick={() => {
                      if (editingNotesId === offer.id) {
                        setEditingNotesId(null);
                      } else {
                        setEditingNotesId(offer.id);
                        setTempNotes(offer.notes || "");
                      }
                    }}
                    className="btn btn-ghost btn-xs gap-2 font-display tracking-wider opacity-60 hover:opacity-100 hover:text-primary transition-all"
                  >
                    Notatki
                  </button>
                </div>

                {editingNotesId === offer.id ? (
                  <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-2">
                    <textarea
                      className="textarea textarea-bordered w-full bg-base-100/30 border-white/5 focus:textarea-primary transition-all h-24 resize-none text-sm"
                      value={tempNotes}
                      onChange={(e) => setTempNotes(e.target.value)}
                      placeholder="Wpisz swoje notatki..."
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingNotesId(null)}
                        className="btn btn-ghost btn-xs"
                      >
                        Anuluj
                      </button>
                      <button
                        onClick={() => {
                          setPendingOfferId(offer.id);
                          startTransition(async () => {
                            try {
                              await updateOfferNotes(offer.id, tempNotes);
                              setEditingNotesId(null);
                            } finally {
                              setPendingOfferId(null);
                            }
                          });
                        }}
                        disabled={isPending && pendingOfferId === offer.id}
                        className="btn btn-primary btn-xs"
                      >
                        {isPending && pendingOfferId === offer.id ? "Zapisywanie..." : "Zapisz"}
                      </button>
                    </div>
                  </div>
                ) : (
                  offer.notes && (
                    <div className="mt-4 p-4 bg-base-300/30 rounded-xl border border-white/5 text-sm text-base-content/60 leading-relaxed font-sans">
                      {offer.notes}
                    </div>
                  )
                )}
              </div>

              <form action={deleteOffer.bind(null, offer.id)} className="flex items-center">
                <button className="btn btn-ghost btn-md text-error/20 hover:text-error hover:bg-error/10 transition-all rounded-xl" type="submit">
                  <Trash2 className="w-6 h-6" />
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
