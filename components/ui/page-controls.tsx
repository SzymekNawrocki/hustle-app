import { Button } from "@/components/ui/button";

interface PageControlsProps {
  page: number;
  totalPages: number;
  total: number;
  unit?: string;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onNext: () => void;
  onPrev: () => void;
}

export function PageControls({
  page,
  totalPages,
  total,
  unit = "items",
  hasNextPage,
  hasPrevPage,
  onNext,
  onPrev,
}: PageControlsProps) {
  return (
    <div className="flex items-center justify-center gap-4 p-6 border-t border-border/60">
      <Button
        variant="outline"
        size="sm"
        onClick={onPrev}
        disabled={!hasPrevPage}
        className="font-display tracking-wide text-xs"
      >
        ← Prev
      </Button>
      <span className="text-xs font-display opacity-40 tracking-wide">
        {page} / {totalPages} &nbsp;·&nbsp; {total} {unit}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={onNext}
        disabled={!hasNextPage}
        className="font-display tracking-wide text-xs"
      >
        Next →
      </Button>
    </div>
  );
}
