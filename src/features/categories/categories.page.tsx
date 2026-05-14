import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronRight } from "lucide-react"
import { Link, useParams, useSearchParams } from "react-router-dom"
import { useCategories } from "./categories.hooks"
import { Button } from "@/components/ui/button"
import ProductGrid from "../products/components/ProductGrid"
import { useProducts } from "../products/products.hooks"
import type { ProductsFilter, SortBy, SortOptions } from "../products/products.types"

const CategoriesPage = () => {
    const { categories, isLoading: isCategoriesLoading, isError: isCategoriesError, errorMessage: categoriesErrorMessage } = useCategories();
    console.log('Categories:', categories);
    const { id } = useParams<{ id: string }>();
    const [ searchParams, setSearchParams ] = useSearchParams();
    const category = categories?.find(c => c.id === id);
    
    const filters: ProductsFilter = {
      category: id,
      subcategory: searchParams.get('subcategory') ?? undefined,
      sortBy: searchParams.get('sortBy') as SortBy ?? 'newest',
      sortOrder: searchParams.get('sortOrder') as SortOptions ?? 'desc',
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
    }

    const { products, isLoading: isProductsLoading, isError: isProductsError, errorMessage: productsErrorMessage } = useProducts(filters);

    if (isCategoriesLoading) {
        return <div>Loading...</div>;
    }

    if (isCategoriesError) {
        return <div>Error: {categoriesErrorMessage}</div>;
    }

    if (!category) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold">Category not found</h1>
        <p className="mt-2 text-muted-foreground">
          The category you're looking for doesn't exist.
        </p>
        <Link to="/products">
          <Button className="mt-4">Browse All Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-64 overflow-hidden bg-muted">
        <img
          src={category.image}
          alt={category.name}
          className="h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background to-transparent" />
        <div className="container absolute inset-0 flex flex-col justify-end pb-8">
          {/* Breadcrumb */}
          <nav className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/products" className="hover:text-foreground">
              Products
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{category.name}</span>
          </nav>

          <h1 className="text-4xl font-bold">{category.name}</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            {category.description}
          </p>
        </div>
      </section>

      <div className="container py-8">
        {/* Subcategories */}
        {category.subcategories && category.subcategories.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            <Badge
              variant={filters.subcategory === null ? "default" : "outline"}
              className="cursor-pointer px-4 py-2"
              onClick={() => setSearchParams((prev) => { prev.delete('subcategory'); return prev; })}
            >
              All {category.name}
            </Badge>
            {category.subcategories.map((sub) => (
              <Badge
                key={sub.id}
                variant={
                  filters.subcategory === sub.id ? "default" : "outline"
                }
                className="cursor-pointer px-4 py-2"
                onClick={() => setSearchParams((prev) => { prev.set('subcategory', sub.id); return prev; })}
              >
                {sub.name} {`(${sub.products_count})`}
              </Badge>
            ))}
          </div>
        )}

        {/* Toolbar */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-muted-foreground">
            Showing {products.length} products
          </p>

          <Select
            value={`${filters.sortBy}:${filters.sortOrder}`}
            onValueChange={(value) => setSearchParams((prev) => { prev.set('sortBy', value.split(':')[0]); prev.set('sortOrder', value.split(':')[1]); return prev; })}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity:desc">Most Popular</SelectItem>
              <SelectItem value="newest:desc">Newest</SelectItem>
              <SelectItem value="price:asc">Price: Low to High</SelectItem>
              <SelectItem value="price:desc">Price: High to Low</SelectItem>
              <SelectItem value="rating:desc">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
          <ProductGrid products={products ?? []} isLoading={isProductsLoading} isError={isProductsError} errorMessage={productsErrorMessage} columns={4} />
      </div>
    </div> 
  )
}

export default CategoriesPage