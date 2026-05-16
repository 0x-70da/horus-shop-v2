import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  useBrands,
  useCategories,
} from "@/features/categories/categories.hooks";
import { useSearchParams } from "react-router-dom";

const ProductsFilterContent = ({
  activeFiltersCount,
  clearFilters,
}: {
  activeFiltersCount: number;
  clearFilters: () => void;
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    errorMessage: categoriesErrorMessage,
  } = useCategories();
  const {
    brands,
    errorMessage: brandsErrorMessage,
    isError: isBrandsError,
    isLoading: isBrandsLoading,
  } = useBrands();

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <Label className="text-base font-semibold">Categories</Label>
        {isCategoriesLoading ? (
          <div>Loading categories...</div>
        ) : isCategoriesError ? (
          <div>Error loading categories: {categoriesErrorMessage}</div>
        ) : categories ? (
          <div className="mt-3 space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center gap-2">
                <Checkbox
                  id={`cat-${category.id}`}
                  checked={searchParams
                    .getAll("category")
                    .includes(category.id)}
                  onCheckedChange={() => {
                    if (searchParams.getAll("category").includes(category.id)) {
                      searchParams.delete("category", category.id);
                    } else {
                      searchParams.append("category", category.id);
                    }
                    setSearchParams(searchParams);
                  }}
                />
                <label
                  htmlFor={`cat-${category.id}`}
                  className="flex-1 cursor-pointer text-sm"
                >
                  {category.name}
                </label>
                <span className="text-xs text-muted-foreground">
                  ({category.products_count})
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div>No categories found.</div>
        )}
      </div>

      <Separator />

      {/* Brands */}
      <div>
        <Label className="text-base font-semibold">Brands</Label>
        {isBrandsLoading ? (
          <div>Loading brands...</div>
        ) : isBrandsError ? (
          <div>Error loading brands: {brandsErrorMessage}</div>
        ) : brands ? (
          <div className="mt-3 space-y-2">
            {brands.map((brand) => (
              <div key={brand.id} className="flex items-center gap-2">
                <Checkbox
                  id={`brand-${brand.id}`}
                  checked={searchParams.getAll("brand").includes(brand.id)}
                  onCheckedChange={() => {
                    if (searchParams.getAll("brand").includes(brand.id)) {
                      searchParams.delete("brand", brand.id);
                    } else {
                      searchParams.append("brand", brand.id);
                    }
                    setSearchParams(searchParams);
                  }}
                />
                <label
                  htmlFor={`brand-${brand.id}`}
                  className="flex-1 cursor-pointer text-sm"
                >
                  {brand.name}
                </label>
                <span className="text-xs text-muted-foreground">
                  ({brand.products_count})
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div>No brands found.</div>
        )}
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <Label className="text-base font-semibold">Price Range</Label>
        <div className="mt-4 px-2">
          <Slider
            value={
              searchParams.get("minPrice") && searchParams.get("maxPrice")
                ? [
                    Number(searchParams.get("minPrice")),
                    Number(searchParams.get("maxPrice")),
                  ]
                : [0, 5000]
            }
            min={0}
            max={5000}
            step={50}
            onValueChange={(value) =>
              setSearchParams((prev) => {
                prev.set("minPrice", String(value[0]));
                prev.set("maxPrice", String(value[1]));
                return prev;
              })
            }
            className="mb-4"
          />
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={searchParams.get("minPrice") ?? "0"}
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
              value={searchParams.get("maxPrice") ?? "5000"}
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
          onCheckedChange={(checked) =>
            setSearchParams((prev) => {
              prev.set("inStock", String(checked === true));
              return prev;
            })
          }
        />
        <label htmlFor="in-stock" className="cursor-pointer text-sm">
          In Stock Only
        </label>
      </div>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          Clear All Filters
        </Button>
      )}
    </div>
  );
};

export default ProductsFilterContent;
