import { cn } from "@/lib/utils";
import { SkeletonCard } from "@/components/ui/skeleton-card";
import type { Product } from "../products.types";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
  className?: string;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
}

const ProductGrid = ({
  products,
  isLoading,
  isError,
  errorMessage,
  columns = 4,
  className,
}: ProductGridProps) => {
  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  };

  if (isLoading) {
    return (
      <div
        className={cn("grid gap-4 md:gap-6", gridCols[columns], className)}
        role="status"
        aria-live="polite"
        aria-label="Loading products"
      >
        <span className="sr-only">Loading products...</span>
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-lg font-medium text-destructive">
          {errorMessage || "Failed to load products"}
        </p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg font-medium text-muted-foreground">
          No products found
        </p>
        <p className="text-sm text-muted-foreground">
          Try adjusting your filters or search criteria
        </p>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-4 md:gap-6", gridCols[columns], className)}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
