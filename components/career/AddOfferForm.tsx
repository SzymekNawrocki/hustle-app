"use client";

import { useState, useTransition } from "react";
import { createOffer } from "@/app/(dashboard)/career/actions";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const STATUSES = ["wysłano", "1 etap", "2 etap", "3 etap", "umowa"] as const;

const STATUS_LABELS: Record<(typeof STATUSES)[number], string> = {
  "wysłano": "Sent",
  "1 etap": "Stage 1",
  "2 etap": "Stage 2",
  "3 etap": "Stage 3",
  "umowa": "Offer",
};

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
        setError(err instanceof Error ? err.message : "Failed to add offer");
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="font-sans">
      <Card className="bg-base-200/50 backdrop-blur-md border border-white/5 shadow-2xl overflow-hidden">
        <CardContent className="p-8 gap-6 flex flex-col">
          <h2 className="text-2xl font-display text-base-content tracking-tight">Add offer</h2>

          <label className="space-y-2">
            <span className="block font-display opacity-50 tracking-wide text-xs">Position</span>
            <Input
              className="bg-base-100/50 border-white/5 transition-all py-6 h-12 rounded-2xl"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Frontend Developer"
              required
            />
          </label>

          <label className="space-y-2">
            <span className="block font-display opacity-50 tracking-wide text-xs">Company</span>
            <Input
              className="bg-base-100/50 border-white/5 transition-all py-6 h-12 rounded-2xl"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Acme"
            />
          </label>

          <label className="space-y-2">
            <span className="block font-display opacity-50 tracking-wide text-xs">Status</span>
            <select
              className="flex h-10 w-full rounded-2xl border border-white/5 bg-base-100/50 px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s} className="bg-base-200">
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="block font-display opacity-50 tracking-wide text-xs">Link</span>
            <Input
              className="bg-base-100/50 border-white/5 transition-all py-6 h-12 rounded-2xl"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              required
            />
          </label>

          <label className="space-y-2">
            <span className="block font-display opacity-50 tracking-wide text-xs">Notes</span>
            <Textarea
              className="bg-base-100/50 border-white/5 transition-all h-24 resize-none rounded-2xl"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional details about the offer..."
            />
          </label>

          {error && (
            <Alert variant="destructive" className="rounded-xl border-none text-xs font-display py-3 tracking-wide">
              <AlertDescription className="text-xs font-display tracking-wide">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <Button
            className="font-display text-lg tracking-wide shadow-[0_0_20px_rgba(123,46,255,0.4)] transition-all hover:scale-[1.02] mt-4 h-12"
            disabled={isPending}
            type="submit"
          >
            {isPending ? "Adding..." : "Add"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
