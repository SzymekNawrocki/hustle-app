import type { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  error?: string;
  children: ReactNode;
}

export function FormField({ label, error, children }: FormFieldProps) {
  return (
    <label className="block space-y-2">
      <span className="font-display text-xs opacity-50 tracking-wide uppercase">{label}</span>
      {children}
      {error && (
        <p className="text-xs text-destructive font-display tracking-wide">{error}</p>
      )}
    </label>
  );
}
