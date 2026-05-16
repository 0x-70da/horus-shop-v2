import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useWishlist } from "./wishlist.hooks";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "../cart/cart.hooks";

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (!wishlistItems.length) {
    return (
      <div className="container py-20 text-center">
        <Heart className="mx-auto h-16 w-16 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-bold">Your wishlist is empty</h1>
        <p className="mt-2 text-muted-foreground">
          Save items you love for later!
        </p>
        <Link to="/products">
          <Button className="mt-6">Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-3xl font-bold">
        Wishlist ({wishlistItems.length})
      </h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {wishlistItems.map((item) => (
          <Card key={item.productId} className="overflow-hidden">
            <div className="aspect-square overflow-hidden">
              <img
                src={item.images[0]}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            </div>
            <CardContent className="p-4">
              <Link
                to={`/products/${item.productId}`}
                className="font-semibold hover:text-primary line-clamp-2"
              >
                {item.name}
              </Link>
              <p className="mt-1 text-lg font-bold">
                ${item.price.toLocaleString()}
              </p>
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 gap-1"
                  onClick={() =>
                    addToCart({
                      itemId: item.productId,
                      variantId: null,
                      quantity: 1,
                    })
                  }
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => removeFromWishlist({ itemId: item.id })}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
