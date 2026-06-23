import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function PostSkeleton() {
  return (
    <Card className="bg-surface-900 border-surface-800 mb-6">
      <CardHeader className="flex flex-row items-center gap-4 p-5 pb-3">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-3 w-[100px]" />
        </div>
      </CardHeader>
      <CardContent className="p-5 pt-0 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
        <div className="flex gap-4 pt-4 border-t border-surface-800/50">
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      </CardContent>
    </Card>
  )
}

export function FeedSkeleton() {
  return (
    <div className="space-y-6">
      <PostSkeleton />
      <PostSkeleton />
      <PostSkeleton />
    </div>
  )
}
