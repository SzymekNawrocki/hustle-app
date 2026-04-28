import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-40 rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-[420px] rounded-2xl" />
          <Skeleton className="h-[360px] rounded-2xl" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-56 rounded-2xl" />
          <Skeleton className="h-56 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}

