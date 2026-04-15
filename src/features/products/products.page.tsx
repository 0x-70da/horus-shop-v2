import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { AnimatePresence, motion } from "framer-motion"
import { Grid3X3, LayoutList, SlidersHorizontal, X } from "lucide-react"
import ProductGrid from "./components/ProductGrid"
import { useProducts } from "./products.hooks"
import { useSearchParams } from "react-router-dom"
import type { ProductsFilter, SortBy, SortOptions } from "./products.types"
import { useState } from "react"
import ProductsFilterContent from "./components/ProductsFiltersContent"

const ProductsPage = () => {
      const [ searchParams, setSearchParams ] = useSearchParams();
      const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
      const [isFilterOpen, setIsFilterOpen] = useState(false);
      
      const filters: ProductsFilter = {
        category: searchParams.get('category') ?? undefined,
        subcategory: searchParams.get('subcategory') ?? undefined,
        sortBy: searchParams.get('sortBy') as SortBy ?? 'newest',
        sortOrder: searchParams.get('sortOrder') as SortOptions ?? 'desc',
        page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
        limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
      }
  
      const { data: products, pagination } = useProducts(filters);

  return (
    <div className="container py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">All Products</h1>
        <p className="text-muted-foreground">
          Showing {products.length} of {products.length} products
        </p>
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Filters</h2>
              {/* {activeFiltersCount > 0 && (
                <Badge variant="secondary">{activeFiltersCount} active</Badge>
              )} */}
            </div>
            <ProductsFilterContent />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Toolbar */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {/* Mobile Filter Button */}
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="gap-2 lg:hidden">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                    {/* {activeFiltersCount > 0 && (
                      <Badge variant="secondary" className="ml-1">
                        {activeFiltersCount}
                      </Badge>
                    )} */}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <ProductsFilterContent />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Active Filters */}
              <AnimatePresence>
                {searchParams.getAll("categories").map((cat) => (
                  <motion.div
                    key={cat}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Badge
                      variant="secondary"
                      className="cursor-pointer gap-1"
                      // onClick={() => toggleCategory(cat)}
                    >
                      {/* {categories.find((c) => c.slug === cat)?.name} */}
                      <X className="h-3 w-3" />
                    </Badge>
                  </motion.div>
                ))}
                {searchParams.getAll("brands").map((brand) => (
                  <motion.div
                    key={brand}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Badge
                      variant="secondary"
                      className="cursor-pointer gap-1"
                      // onClick={() => toggleBrand(brand)}
                    >
                      {brand}
                      <X className="h-3 w-3" />
                    </Badge>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-2">
              {/* Sort */}
              <Select
                value={`${searchParams.get("sortBy") ?? undefined}-${searchParams.get("sortOrder") ?? undefined}`}
                onValueChange={(value) => setSearchParams((prev) => {
                  prev.set("sortBy", value.split("-")[0]);
                  prev.set("sortOrder", value.split("-")[1]);
                  return prev;
                })}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity-desc">Most Popular</SelectItem>
                  <SelectItem value="newest-desc">Newest</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating-desc">Highest Rated</SelectItem>
                </SelectContent>
              </Select>

              {/* View Toggle */}
              <div className="hidden items-center gap-1 rounded-lg border p-1 sm:flex">
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode('list')}
                >
                  <LayoutList className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Products */}
          <ProductGrid
            products={products}
            columns={viewMode === 'list' ? 2 : 4}
          />
        </main>
      </div>
    </div>
  )
}

export default ProductsPage