import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"
import { Minus, Plus, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"
import { useCart, useClearCart, useRemoveFromCart, useUpdateCartItem } from "./cart.hooks"

const CartPage = () => {
    const { items } = useCart();
    const { mutate: updateQuantity } = useUpdateCartItem();
    const { mutate: removeFromCart } = useRemoveFromCart();
    const { mutate: clearCart } = useClearCart();
    const subtotal = items?.reduce((total, item) => total + item.price * item.quantity, 0) ?? 0;
    const shipping = subtotal > 100 ? 0 : 10;
    const tax = subtotal * 0.07;
    const finalTotal = subtotal + shipping + tax;

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {items?.map((item) => (
            <motion.div
              key={`${item.id}`}
              layout
              className="flex gap-4 rounded-lg border p-4"
            >
              <img
                src={item.images[0]}
                alt={item.name}
                className="h-24 w-24 rounded-lg object-cover"
              />
              <div className="flex-1">
                <Link
                  to={`/product/${item.productId}`}
                  className="font-semibold hover:text-primary"
                >
                  {item.name}
                </Link>
                {/* {item.selectedVariant && (
                  <p className="text-sm text-muted-foreground">
                    {item.selectedVariant.name}
                  </p>
                )} */}
                {/* <p className="text-lg font-bold">
                  $
                  {(
                    item.selectedVariant?.price ?? item.product.price
                  ).toLocaleString()}
                </p> */}
                <div className="mt-2 flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      updateQuantity({
                        cartItemId: item.productId, quantity: item.quantity - 1
                      })
                    }
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      updateQuantity({
                        cartItemId: item.productId, quantity: item.quantity + 1
                      })
                    }
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto text-destructive"
                    onClick={() =>
                      removeFromCart({ cartItemId: item.productId })
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              {/* <span>${subtotal.toFixed(2)}</span> */}
            </div>
            {/* {promoDiscount > 0 && (
              <div className="flex justify-between text-success">
                <span>Discount ({promoDiscount}%)</span>
                <span>-${((subtotal * promoDiscount) / 100).toFixed(2)}</span>
              </div>
            )} */}
            <div className="flex justify-between">
              <span>Shipping</span>
              {/* <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span> */}
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              {/* <span>${tax.toFixed(2)}</span> */}
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
            {/* <div className="flex gap-2">
              <Input
                placeholder="Promo code"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
              />
              <Button variant="outline" onClick={handleApplyPromo}>
                Apply
              </Button>
            </div> */}
            <Button className="w-full" size="lg">
              Proceed to Checkout
            </Button>
            <Link to="/products">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CartPage