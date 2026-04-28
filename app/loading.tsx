import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="w-full max-w-3xl space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-96" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

