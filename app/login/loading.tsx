import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-card/60 backdrop-blur-xl border border-border/60 shadow-[0_0_50px_rgba(0,0,0,0.6)]">
          <CardContent className="p-8 lg:p-10 space-y-8">
            <div className="text-center space-y-4">
              <div className="flex flex-col items-center gap-4">
                <Skeleton className="h-14 w-14 rounded-2xl" />
                <Skeleton className="h-10 w-40" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-40 mx-auto" />
                <Skeleton className="h-4 w-64 mx-auto" />
              </div>
            </div>

            <div className="space-y-6">
              <Skeleton className="h-12 rounded-2xl" />
              <Skeleton className="h-12 rounded-2xl" />
              <Skeleton className="h-12 rounded-2xl" />
              <Skeleton className="h-12 rounded-2xl" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

