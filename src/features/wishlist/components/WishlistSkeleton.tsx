import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonCard } from "@/components/ui/skeleton-card";

export function WishlistSkeleton() {
  return (
    <div
      className="container py-8"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading wishlist...</span>
      <Skeleton className="mb-8 h-9 w-48" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
