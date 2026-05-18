import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Zap, Star, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ErrorDisplay } from "@/components/ui/error-display";
import {
  useBrands,
  useCategories,
} from "@/features/categories/categories.hooks";
import ProductGrid from "@/features/products/components/ProductGrid";
import { useProducts } from "@/features/products/products.hooks";
import { usePromoBanners } from "@/features/promo/promo.hooks";

// ============================================
// Home Page
// ============================================
// Main landing page with hero, categories, featured products, etc.
// TODO: Replace mock data imports with API calls

const Home = () => {
  const {
    categories,
    isError: isCategoriesError,
    refetchCategories,
  } = useCategories();
  const { products, isProductsError, productsErrorMessage, refetchProducts } =
    useProducts();
  const { brands, isError: isBrandsError, refetchBrands } = useBrands();
  const { promoBanners } = usePromoBanners();
  // const { flashDeals } = useFlashDeals();
  const bestSellers = products.filter((p) => p.totalSold > 100);
  const newArrivals = [...products]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 8);
  const featuredProducts = products.filter((p) => p.rating >= 4.5).slice(0, 8);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-background via-background to-primary/5">
        <div className="container py-12 md:py-20">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Hero Content */}
            <motion.div
              initial={false}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col justify-center"
            >
              <Badge variant="outline" className="mb-4 w-fit">
                <Zap className="mr-1 h-3 w-3" /> {promoBanners[0]?.title}
              </Badge>
              <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
                The Future of
                <span className="block text-primary">Tech is Here</span>
              </h1>
              <p className="mb-6 max-w-md text-lg text-muted-foreground">
                Discover the latest smartphones, laptops, audio gear, and gaming
                equipment at unbeatable prices. Up to 40% off this season.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/products">
                  <Button size="lg" className="gap-2">
                    Shop Now
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/category/smartphones">
                  <Button size="lg" variant="outline">
                    Explore Phones
                  </Button>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-warning text-warning" />
                  <span>4.9/5 Rating</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>100K+ Customers</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>Free Shipping</span>
                </div>
              </div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={false}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative aspect-square overflow-hidden rounded-3xl bg-linear-to-br from-muted to-muted/50">
                <img
                  src={promoBanners[0]?.image}
                  alt="Featured product"
                  className="h-full w-full object-cover"
                />
                {/* Floating product card */}
                <motion.div
                  initial={false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                  className="absolute bottom-4 left-4 right-4 rounded-2xl bg-background/90 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Featured</p>
                      <p className="font-semibold">iPhone 15 Pro Max</p>
                      <p className="text-lg font-bold text-primary">$1,199</p>
                    </div>
                    <Link to="/products/iphone-15-pro-max">
                      <Button size="sm">View</Button>
                    </Link>
                  </div>
                </motion.div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
              <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-primary/5 blur-3xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="border-y border-border bg-muted/30 py-12">
        <div className="container">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold md:text-3xl">
                Shop by Category
              </h2>
              <p className="text-muted-foreground">
                Browse our wide selection of tech products
              </p>
            </div>
            <Link to="/products">
              <Button variant="ghost" className="gap-1">
                View All
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {isCategoriesError ? (
              <div className="col-span-full">
                <ErrorDisplay
                  message="Failed to load categories"
                  onRetry={refetchCategories}
                />
              </div>
            ) : (
              categories?.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link to={`/category/${category.slug}`}>
                    <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <CardContent className="p-3 text-center">
                        <h3 className="font-semibold group-hover:text-primary">
                          {category.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {category.products_count} products
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="container">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold md:text-3xl">
                  Featured Products
                </h2>
                <p className="text-muted-foreground">
                  Hand-picked just for you
                </p>
              </div>
            </div>
            <Link to="/products">
              <Button variant="ghost" className="gap-1">
                View All
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          {isProductsError ? (
            <ErrorDisplay
              message={productsErrorMessage}
              onRetry={refetchProducts}
            />
          ) : (
            <ProductGrid products={featuredProducts} columns={4} />
          )}{" "}
          {/* featured products should ideally come from a separate API endpoint, but using all products for now*/}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="bg-muted/30 py-12">
        <div className="container">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                <TrendingUp className="h-5 w-5 text-warning" />
              </div>
              <div>
                <h2 className="text-2xl font-bold md:text-3xl">Best Sellers</h2>
                <p className="text-muted-foreground">Most popular this week</p>
              </div>
            </div>
            <Link to="/products">
              <Button variant="ghost" className="gap-1">
                View All
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {isProductsError ? (
            <ErrorDisplay
              message={productsErrorMessage}
              onRetry={refetchProducts}
            />
          ) : (
            <ProductGrid products={bestSellers} columns={4} />
          )}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-12">
        <div className="container">
          <Card className="overflow-hidden bg-linear-to-r from-primary/10 via-background to-primary/5">
            <div className="grid gap-6 p-6 md:grid-cols-2 md:p-10">
              <div className="flex flex-col justify-center">
                <Badge className="mb-4 w-fit">Limited Time Offer</Badge>
                <h2 className="mb-2 text-3xl font-bold md:text-4xl">
                  {promoBanners[0]?.title}
                </h2>
                <p className="mb-6 text-lg text-muted-foreground">
                  On all audio products. Use code{" "}
                  <span className="font-mono font-bold text-foreground">
                    AUDIO20
                  </span>{" "}
                  at checkout.
                </p>
                <div>
                  <Link to="/category/audio">
                    <Button size="lg" className="gap-2">
                      Shop Audio
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop"
                  alt="Audio promotion"
                  className="rounded-2xl object-cover"
                />
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-12">
        <div className="container">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
                <Star className="h-5 w-5 text-info" />
              </div>
              <div>
                <h2 className="text-2xl font-bold md:text-3xl">New Arrivals</h2>
                <p className="text-muted-foreground">Fresh products just in</p>
              </div>
            </div>
            <Link to="/products">
              <Button variant="ghost" className="gap-1">
                View All
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {isProductsError ? (
            <ErrorDisplay
              message={productsErrorMessage}
              onRetry={refetchProducts}
            />
          ) : (
            <ProductGrid products={newArrivals} columns={4} />
          )}
        </div>
      </section>

      {/* Brands Section */}
      <section className="border-t border-border bg-muted/30 py-12">
        <div className="container">
          <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">
            Trusted by Leading Brands
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
            {isBrandsError ? (
              <ErrorDisplay
                message="Failed to load brands"
                onRetry={refetchBrands}
              />
            ) : (
              brands.map((brand) => (
                <div
                  key={brand.id}
                  className="text-2xl font-bold tracking-tight text-muted-foreground"
                >
                  {brand.name}
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
