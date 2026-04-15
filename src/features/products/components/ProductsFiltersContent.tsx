import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { useCategories } from "@/features/categories/categories.hooks";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "../products.hooks";

const ProductsFilterContent = () => {
    const [ searchParams, setSearchParams ] = useSearchParams();
    const { categories, isLoading, isError, errorMessage} = useCategories();
    const {data: products} = useProducts();

    return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <Label className="text-base font-semibold">Categories</Label>
        {isLoading ? (
          <div>Loading categories...</div>
        ) : isError ? (
          <div>Error loading categories: {errorMessage}</div>
        ) : categories ? (
        <div className="mt-3 space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center gap-2">
              <Checkbox
                id={`cat-${category.slug}`}
                checked={searchParams.getAll("category").includes(category.slug)}
                onCheckedChange={() => {
                  if (searchParams.getAll("category").includes(category.slug)) {
                    searchParams.delete("category", category.slug);
                  } else {
                    searchParams.append("category", category.slug);
                  }
                  setSearchParams(searchParams);
                }}
              />
              <label
                htmlFor={`cat-${category.slug}`}
                className="flex-1 cursor-pointer text-sm"
              >
                {category.name}
              </label>
              <span className="text-xs text-muted-foreground">
                {/* ({category.productCount}) */} Products count per category
              </span>
            </div>
          ))}
        </div>) : (
          <div>No categories found.</div>
        )}
      </div>

      <Separator />

      {/* Brands */}
      <div>
        <Label className="text-base font-semibold">Brands</Label>
        <div className="mt-3 space-y-2">
          {products?.map((product) => (
            <div key={product.id} className="flex items-center gap-2">
              <Checkbox
                id={`brand-${product.id}`}
                // checked={selectedBrands.includes(product.brand)}
                // onCheckedChange={() => toggleBrand(product.brand)}
              />
              <label
                htmlFor={`brand-${product.id}`}
                className="flex-1 cursor-pointer text-sm"
              >
                {product.brand}
              </label>
              <span className="text-xs text-muted-foreground">
                {/* ({brand.productCount}) */}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <Label className="text-base font-semibold">Price Range</Label>
        <div className="mt-4 px-2">
          <Slider
            value={searchParams.get("minPrice") && searchParams.get("maxPrice") ? [Number(searchParams.get("minPrice")), Number(searchParams.get("maxPrice"))] : [0, 5000]}
            min={0}
            max={5000}
            step={50}
            onValueChange={(value) => setSearchParams((prev) => {
              prev.set("minPrice", String(value[0]));
              prev.set("maxPrice", String(value[1]));
              return prev;
            })}
            className="mb-4"
          />
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={searchParams.get("minPrice") ?? ''}
              onChange={(e) =>
                setSearchParams((prev) => {
                  prev.set("minPrice", String(Number(e.target.value)));
                  return prev;
                })
              }
              className="h-8"
            />
            <span className="text-muted-foreground">-</span>
            <Input
              type="number"
              value={searchParams.get("maxPrice") ?? ''}
              onChange={(e) =>
                setSearchParams((prev) => {
                  prev.set("maxPrice", String(Number(e.target.value)));
                  return prev;
                })
              }
              className="h-8"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Stock Filter */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="in-stock"
          checked={searchParams.get("inStock") === "true"}
          onCheckedChange={(checked) => setSearchParams((prev) => {
            prev.set("inStock", String(checked === true));
            return prev;
          })}
        />
        <label htmlFor="in-stock" className="cursor-pointer text-sm">
          In Stock Only
        </label>
      </div>

      {/* Clear Filters */}
      {/* {activeFiltersCount > 0 && (
        <Button
          variant="outline"
          className="w-full"
          onClick={clearFilters}
        >
          Clear All Filters
        </Button>
      )} */}
    </div>
  )};

export default ProductsFilterContent;