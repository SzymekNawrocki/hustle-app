import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-4 w-80" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Skeleton className="h-[520px] rounded-2xl" />
        <Skeleton className="lg:col-span-2 h-[520px] rounded-2xl" />
      </div>
    </div>
  )
}

