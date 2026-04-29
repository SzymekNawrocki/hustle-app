"use client";

import { useState } from "react";
import { Trash2, ExternalLink } from "lucide-react";
import { useJobOffers } from "@/hooks/use-job-offers";
import type { OfferStatus } from "@/types/api";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

const STATUSES: OfferStatus[] = ["wysłano", "1 etap", "2 etap", "3 etap", "umowa"];

const STATUS_LABELS: Record<OfferStatus, string> = {
  "wysłano": "Sent",
  "1 etap": "Stage 1",
  "2 etap": "Stage 2",
  "3 etap": "Stage 3",
  "umowa": "Offer",
};

export default function OfferList() {
  const { data, isLoading, offers, page, setPage, nextPage, prevPage, hasNextPage, hasPrevPage, remove, update } =
    useJobOffers();
  const [editingNotesId, setEditingNotesId] = useState<number | null>(null);
  const [tempNotes, setTempNotes] = useState("");

  if (isLoading) {
    return (
      <Card className="bg-card/60 backdrop-blur-md border border-border/60 shadow-2xl overflow-hidden font-sans">
        <CardHeader className="p-8 border-b border-border/60 bg-muted/30">
          <Skeleton className="h-8 w-32" />
        </CardHeader>
        <CardContent className="p-8 space-y-4">
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/60 backdrop-blur-md border border-border/60 shadow-2xl overflow-hidden font-sans">
      <CardHeader className="p-8 border-b border-border/60 flex flex-row items-center justify-between bg-muted/30">
        <CardTitle className="text-2xl font-display text-foreground tracking-tight">Offers</CardTitle>
        <Badge className="font-display px-4 py-3">{data?.total ?? 0}</Badge>
      </CardHeader>

      <CardContent className="p-0">
        <div className="divide-y divide-white/5">
          {offers.length === 0 && (
            <div className="p-16 text-center text-muted-foreground font-display text-xl tracking-wide">
              No offers yet. Add your first one.
            </div>
          )}

          {offers.map((offer) => (
            <div key={offer.id} className="p-8 flex flex-col sm:flex-row sm:items-center gap-6 hover:bg-primary/5 transition-all">
              <div className="flex-1 min-w-0">
                <div className="font-display text-2xl text-foreground tracking-tight truncate">
                  {offer.title}
                  {offer.company ? <span className="text-secondary opacity-60"> {` @ ${offer.company}`}</span> : null}
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <Badge variant="secondary" className="font-display text-xs py-2.5 px-3.5 tracking-wide">
                    {STATUS_LABELS[offer.status as OfferStatus] ?? offer.status}
                  </Badge>
                  <select
                    name="status"
                    defaultValue={offer.status}
                    className="flex h-8 rounded-xl border border-border/60 bg-muted/30 px-2 text-xs font-display tracking-wide shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
                    disabled={update.isPending}
                    onChange={(e) => {
                      update.mutate({ id: offer.id, payload: { status: e.target.value as OfferStatus } });
                    }}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s} className="bg-popover">
                        {STATUS_LABELS[s]}
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
                      Open link
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
                    Notes
                  </Button>
                </div>

                {editingNotesId === offer.id ? (
                  <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-2">
                    <Textarea
                      className="w-full bg-background/40 border-border/60 transition-all h-24 resize-none text-sm rounded-2xl"
                      value={tempNotes}
                      onChange={(e) => setTempNotes(e.target.value)}
                      placeholder="Write your notes..."
                    />
                    <div className="flex justify-end gap-2">
                      <Button onClick={() => setEditingNotesId(null)} variant="ghost" size="xs">
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          update.mutate(
                            { id: offer.id, payload: { notes: tempNotes } },
                            { onSuccess: () => setEditingNotesId(null) }
                          );
                        }}
                        disabled={update.isPending}
                        size="xs"
                      >
                        {update.isPending ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  offer.notes && (
                    <div className="mt-4 p-4 bg-muted/30 rounded-xl border border-border/60 text-sm text-muted-foreground leading-relaxed font-sans">
                      {offer.notes}
                    </div>
                  )
                )}
              </div>

              <Button
                onClick={() =>
                  remove.mutate(offer.id, {
                    onSuccess: () => {
                      if (offers.length === 1 && page > 1) setPage((p) => p - 1);
                    },
                  })
                }
                variant="ghost"
                size="icon"
                className="text-destructive/60 hover:text-destructive hover:bg-destructive/10 transition-all rounded-xl"
                disabled={remove.isPending}
              >
                {remove.isPending ? (
                  <span className="h-4 w-4 rounded-full border-2 border-current/30 border-t-current animate-spin" />
                ) : (
                  <Trash2 className="w-6 h-6" />
                )}
              </Button>
            </div>
          ))}
        </div>

        {data && data.pages > 1 && (
          <div className="flex items-center justify-center gap-4 p-6 border-t border-border/60">
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
              {page} / {data.pages} &nbsp;·&nbsp; {data.total} offers
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
      </CardContent>
    </Card>
  );
}
