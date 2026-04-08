"use client";

import { useState, useTransition } from "react";
import { Trash2, ExternalLink } from "lucide-react";
import { deleteOffer, updateOfferStatus, updateOfferNotes } from "@/app/(dashboard)/career/actions";
import type { JobOffer } from "@/types/api";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const STATUSES = ["wysłano", "1 etap", "2 etap", "3 etap", "umowa"] as const;

export default function OfferList({ offers }: { offers: JobOffer[] }) {
  const [isPending, startTransition] = useTransition();
  const [pendingOfferId, setPendingOfferId] = useState<number | null>(null);
  const [editingNotesId, setEditingNotesId] = useState<number | null>(null);
  const [tempNotes, setTempNotes] = useState("");

  return (
    <Card className="bg-base-200/50 backdrop-blur-md border border-white/5 shadow-2xl overflow-hidden font-sans">
      <CardHeader className="p-8 border-b border-white/5 flex flex-row items-center justify-between bg-base-300/30">
        <CardTitle className="text-2xl font-display text-base-content tracking-tight">Oferty</CardTitle>
        <Badge className="font-display px-4 py-3">{offers.length}</Badge>
      </CardHeader>

      <CardContent className="p-0">
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
                  <Badge variant="secondary" className="font-display text-xs py-2.5 px-3.5 tracking-wide">
                    {offer.status}
                  </Badge>
                  <select
                    name="status"
                    defaultValue={offer.status}
                    className="flex h-8 rounded-xl border border-white/5 bg-base-300/50 px-2 text-xs font-display tracking-wide shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
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
                  <Button
                    asChild
                    variant="ghost"
                    size="xs"
                    className="gap-2 font-display tracking-wider opacity-60 hover:opacity-100 hover:text-primary transition-all"
                  >
                    <a href={offer.url} target="_blank" rel="noreferrer">
                      <ExternalLink className="w-4 h-4" />
                      Link
                    </a>
                  </Button>
                  <Button
                    onClick={() => {
                      if (editingNotesId === offer.id) {
                        setEditingNotesId(null);
                      } else {
                        setEditingNotesId(offer.id);
                        setTempNotes(offer.notes || "");
                      }
                    }}
                    variant="ghost"
                    size="xs"
                    className="gap-2 font-display tracking-wider opacity-60 hover:opacity-100 hover:text-primary transition-all"
                  >
                    Notatki
                  </Button>
                </div>

                {editingNotesId === offer.id ? (
                  <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-2">
                    <Textarea
                      className="w-full bg-base-100/30 border-white/5 transition-all h-24 resize-none text-sm rounded-2xl"
                      value={tempNotes}
                      onChange={(e) => setTempNotes(e.target.value)}
                      placeholder="Wpisz swoje notatki..."
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        onClick={() => setEditingNotesId(null)}
                        variant="ghost"
                        size="xs"
                      >
                        Anuluj
                      </Button>
                      <Button
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
                        size="xs"
                      >
                        {isPending && pendingOfferId === offer.id ? "Zapisywanie..." : "Zapisz"}
                      </Button>
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-error/40 hover:text-error hover:bg-error/10 transition-all rounded-xl"
                  type="submit"
                >
                  <Trash2 className="w-6 h-6" />
                </Button>
              </form>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
