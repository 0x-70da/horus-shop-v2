import { Skeleton } from "./skeleton";

export function SkeletonCard() {
  return (
    <div data-slot="skeleton-card" className="space-y-3">
      <Skeleton className="aspect-square w-full rounded-xl" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-1/4" />
    </div>
  );
}
