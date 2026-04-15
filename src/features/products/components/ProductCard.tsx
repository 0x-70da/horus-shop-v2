import { Link } from "react-router-dom";
import type { Product } from "../products.types";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useAddToCart } from "@/features/cart/cart.hooks";

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard = ({ product, className }: ProductCardProps) => {
     const { mutate: addToCart } = useAddToCart();
//   const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
//   const isInWishlist = useWishlistStore((s) =>
//     s.items.some((item) => item.productId === product.id),
//   );

//   const handleAddToCart = (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     addToCart(product, 1);
//     toast.success(`${product.name} added to cart`);
//   };

//   const handleToggleWishlist = (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     toggleWishlist(product);
//     toast.success(
//       isInWishlist
//         ? `${product.name} removed from wishlist`
//         : `${product.name} added to wishlist`,
//     );
//   };

  const discountPercent = product.original_price
    ? Math.round(
        ((product.original_price - product.price) / product.original_price) * 100,
      )
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div /*to={`/product/${product.slug}`}*/>
        <Card
          className={cn(
            "group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1",
            className,
          )}
        >
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-muted">
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Badges */}
            <div className="absolute left-2 top-2 flex flex-col gap-1">
              {discountPercent > 0 && (
                <Badge className="bg-primary text-primary-foreground">
                  -{discountPercent}%
                </Badge>
              )}
              {/* {product.newArrival && (
                <Badge className="bg-info text-info-foreground">New</Badge>
              )}
              {product.bestSeller && (
                <Badge className="bg-warning text-warning-foreground">
                  Bestseller
                </Badge>
              )} */}
              {product.stock <= 5 && product.stock > 0 && (
                <Badge variant="outline" className="bg-background/80">
                  Only {product.stock} left
                </Badge>
              )}
              {product.stock === 0 && (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>

            {/* Wishlist Button */}
            <Button
              variant="secondary"
              size="icon"
              className={cn(
                "absolute right-2 top-2 h-8 w-8 opacity-0 transition-all group-hover:opacity-100",
                // isInWishlist && "opacity-100",
              )}
            //   onClick={handleToggleWishlist}
            >
              <Heart
                className={cn(
                  "h-4 w-4",
                //   isInWishlist && "fill-primary text-primary",
                )}
              />
            </Button>

            {/* Quick Add Button */}
            <div className="absolute bottom-0 left-0 right-0 translate-y-full bg-linear-to-t from-background/90 to-transparent p-3 transition-transform duration-300 group-hover:translate-y-0">
              <Button
                className="w-full gap-2"
                size="sm"
                onClick={() => addToCart({ productId: product.id, quantity: 1})}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="h-4 w-4" />
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </Button>
            </div>
          </div>

          <CardContent className="p-4">
            {/* Brand */}
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {/* {product.brand} */} product brand
            </p>

            {/* Product Name */}
            <h3 className="mb-2 line-clamp-2 text-sm font-semibold leading-tight transition-colors group-hover:text-primary">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="mb-2 flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-warning text-warning" />
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-xs text-muted-foreground">
                ({product.review_count?.toLocaleString()})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">
                ${product.price.toLocaleString()}
              </span>
              {product.original_price && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.original_price.toLocaleString()}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default ProductCard;
