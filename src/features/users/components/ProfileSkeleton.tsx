import { Skeleton } from "@/components/ui/skeleton"

export function ProfileSkeleton() {
  return (
    <div className="container py-8">
      <Skeleton className="mb-8 h-9 w-40" />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border p-6">
          <Skeleton className="mb-4 h-6 w-32" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-56" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>
        <div className="rounded-lg border p-6">
          <Skeleton className="mb-4 h-6 w-28" />
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="mb-1 h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
