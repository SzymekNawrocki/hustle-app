import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-10">
      <div className="flex items-end justify-between gap-6">
        <div className="space-y-3">
          <Skeleton className="h-12 w-56" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>
      <div className="space-y-6">
        <Skeleton className="h-40 rounded-[3rem]" />
        <Skeleton className="h-72 rounded-[2.5rem]" />
      </div>
    </div>
  )
}

