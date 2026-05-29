"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EditModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  title: string;
  isPending?: boolean;
  isError?: boolean;
  errorMessage?: string;
  children: React.ReactNode;
}

export function EditModal({
  open,
  onClose,
  onSave,
  title,
  isPending = false,
  isError = false,
  errorMessage,
  children,
}: EditModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <Card
        className="w-full max-w-md mx-4 bg-card border border-border/60 shadow-2xl rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <CardContent className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display tracking-tight">{title}</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {children}

          {isError && (
            <p className="text-xs text-destructive font-display tracking-wide">
              {errorMessage ?? "Failed to save changes."}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1 font-display tracking-wide"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 font-display tracking-wide shadow-[0_0_20px_rgba(123,46,255,0.3)]"
              onClick={onSave}
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
