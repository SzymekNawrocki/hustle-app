"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useJobOffers } from "@/hooks/use-job-offers";
import { offerSchema, type OfferFormValues } from "@/lib/schemas";
import { JOB_STATUSES, JOB_STATUS_LABELS } from "@/lib/domain-constants";
import { FormField } from "@/components/ui/form-field";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AddOfferForm() {
  const { create } = useJobOffers();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<OfferFormValues>({
    resolver: zodResolver(offerSchema),
    defaultValues: { status: "wysłano" as const },
  });

  const onSubmit = handleSubmit((values) => {
    create.mutate(
      {
        title:   values.title,
        company: values.company?.trim() || undefined,
        status:  values.status,
        url:     values.url,
        notes:   values.notes?.trim() || undefined,
      },
      { onSuccess: () => reset() }
    );
  });

  return (
    <form onSubmit={onSubmit} className="font-sans">
      <Card className="bg-card/60 backdrop-blur-md border border-border/60 shadow-2xl overflow-hidden">
        <CardContent className="p-8 gap-6 flex flex-col">
          <h2 className="text-2xl font-display text-foreground tracking-tight">Add offer</h2>

          <FormField label="Position" error={errors.title?.message}>
            <Input
              className="bg-background/40 border-border/60 transition-all py-6 h-12 rounded-2xl"
              placeholder="e.g. Frontend Developer"
              {...register("title")}
            />
          </FormField>

          <FormField label="Company" error={errors.company?.message}>
            <Input
              className="bg-background/40 border-border/60 transition-all py-6 h-12 rounded-2xl"
              placeholder="e.g. Acme"
              {...register("company")}
            />
          </FormField>

          <FormField label="Status" error={errors.status?.message}>
            <select
              className="flex h-10 w-full rounded-2xl border border-border/60 bg-background/40 px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
              {...register("status")}
            >
              {JOB_STATUSES.map((s) => (
                <option key={s} value={s} className="bg-popover">
                  {JOB_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Link" error={errors.url?.message}>
            <Input
              className="bg-background/40 border-border/60 transition-all py-6 h-12 rounded-2xl"
              placeholder="https://..."
              {...register("url")}
            />
          </FormField>

          <FormField label="Notes" error={errors.notes?.message}>
            <Textarea
              className="bg-background/40 border-border/60 transition-all h-24 resize-none rounded-2xl"
              placeholder="Additional details about the offer..."
              {...register("notes")}
            />
          </FormField>

          {create.isError && (
            <Alert variant="destructive" className="rounded-xl border-none text-xs font-display py-3 tracking-wide">
              <AlertDescription className="text-xs font-display tracking-wide">
                {create.error instanceof Error ? create.error.message : "Failed to add offer"}
              </AlertDescription>
            </Alert>
          )}

          <Button
            className="font-display text-lg tracking-wide shadow-[0_0_20px_rgba(123,46,255,0.4)] transition-all hover:scale-[1.02] mt-4 h-12"
            disabled={create.isPending}
            type="submit"
          >
            {create.isPending ? "Adding..." : "Add"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
