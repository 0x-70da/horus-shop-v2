// features/orders/checkout.page.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useShippingMethods,
  useValidatePromoCode,
  useOrders,
} from "./orders.hooks";
import { useAddresses } from "../addresses/addresses.hooks";
import { useCart } from "../cart/cart.hooks";
import type { PaymentMethod } from "./orders.types";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorDisplay } from "@/components/ui/error-display";

export default function CheckoutPage() {
  const navigate = useNavigate();

  const { items, subtotal = 0 } = useCart();
  const { addresses } = useAddresses();
  const {
    shippingMethods,
    isShippingLoading,
    isShippingError,
    refetchShippingMethods,
  } = useShippingMethods();

  const { createOrder, isCreateOrderLoading: isPlacingOrder } = useOrders();
  const { validatePromo, isValidatingPromo } = useValidatePromoCode();

  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedShipping, setSelectedShipping] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("credit_card");
  const [promoCode, setPromoCode] = useState("");
  const [promoResult, setPromoResult] = useState<{
    discount: number;
    promoId: string;
  } | null>(null);
  const [promoError, setPromoError] = useState("");
  const [notes, setNotes] = useState("");
  const [taxRate, setTaxRate] = useState(0.14);

  useEffect(() => {
    api
      .get("/tax?country=EG")
      .then(({ data }) => {
        if (data.success) setTaxRate(data.data.rate);
      })
      .catch(() => {});
  }, []);
  const selectedShippingMethod = shippingMethods?.find(
    (m) => m.id === selectedShipping,
  );
  const discount = promoResult?.discount ?? 0;
  const afterDiscount = subtotal - discount;
  const shippingCost =
    selectedShippingMethod?.free_above !== null &&
    selectedShippingMethod?.free_above !== undefined &&
    afterDiscount >= selectedShippingMethod.free_above
      ? 0
      : (selectedShippingMethod?.base_cost ?? 0);
  const tax = parseFloat((afterDiscount * taxRate).toFixed(2));
  const total = afterDiscount + shippingCost + tax;

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoError("");
    setPromoResult(null);

    try {
      const result = await validatePromo({
        code: promoCode,
        orderTotal: subtotal ?? 0,
      });
      setPromoResult({
        discount: result.data?.discount ?? 0,
        promoId: result.data?.promoId ?? "",
      });
      toast.success(`Promo applied! Discount: ${result.data?.discount} EGP`);
    } catch {
      setPromoError("Invalid or expired promo code");
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select an address");
      return;
    }
    if (!selectedShipping) {
      toast.error("Please select a shipping method");
      return;
    }

    try {
      const result = await createOrder({
        addressId: selectedAddress,
        shippingMethodId: selectedShipping,
        paymentMethod,
        promoCode: promoResult ? promoCode : undefined,
        notes: notes || undefined,
      });

      if (result.data?.requiresPayment && result.data?.clientSecret) {
        navigate("/checkout/payment", {
          state: {
            clientSecret: result.data?.clientSecret,
            orderId: result.data?.order_id,
            total: result.data?.total,
          },
        });
        return;
      }

      navigate(`/orders/${result.data?.order_id}`, {
        state: { newOrder: true },
      });
    } catch {
      // Error toast already handled by useOrders onError
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ===== Left: Steps ===== */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Address */}
          <section className="border rounded-lg p-4">
            <h2 className="font-semibold mb-3">Delivery Address</h2>
            {!addresses?.length ? (
              <p className="text-sm text-muted-foreground">
                No addresses found.{" "}
                <a href="/profile/addresses" className="underline">
                  Add one
                </a>
              </p>
            ) : (
              <div className="space-y-2">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`flex items-start gap-3 p-3 border rounded cursor-pointer
                      ${selectedAddress === addr.id ? "border-primary bg-primary/5" : ""}`}
                  >
                    <input
                      type="radio"
                      name="address"
                      value={addr.id}
                      checked={selectedAddress === addr.id}
                      onChange={() => setSelectedAddress(addr.id)}
                      className="mt-1"
                    />
                    <div className="text-sm">
                      <p className="font-medium">{addr.full_name}</p>
                      <p className="text-muted-foreground">
                        {addr.address_line}, {addr.city}, {addr.country}
                      </p>
                      {addr.phone && (
                        <p className="text-muted-foreground">{addr.phone}</p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}
          </section>

          {/* 2. Shipping */}
          <section className="border rounded-lg p-4">
            <h2 className="font-semibold mb-3">Shipping Method</h2>
            {isShippingLoading ? (
              <div
                className="space-y-2"
                role="status"
                aria-live="polite"
                aria-busy="true"
              >
                <span className="sr-only">Loading shipping methods...</span>
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-lg" />
                ))}
              </div>
            ) : isShippingError ? (
              <ErrorDisplay
                message="Failed to load shipping options. Please try again."
                onRetry={refetchShippingMethods}
              />
            ) : (
              <div className="space-y-2">
                {shippingMethods
                  ?.filter((m) => m.is_active)
                  .map((method) => {
                    const isFree =
                      method.free_above !== null &&
                      method.free_above !== undefined &&
                      afterDiscount >= method.free_above;

                    return (
                      <label
                        key={method.id}
                        className={`flex items-center justify-between p-3 border rounded cursor-pointer
                      ${selectedShipping === method.id ? "border-primary bg-primary/5" : ""}`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shipping"
                            value={method.id}
                            checked={selectedShipping === method.id}
                            onChange={() => setSelectedShipping(method.id)}
                          />
                          <div className="text-sm">
                            <p className="font-medium">{method.name}</p>
                            <p className="text-muted-foreground">
                              {method.carrier && `${method.carrier} · `}
                              {method.estimated_days} business days
                            </p>
                          </div>
                        </div>
                        <span className="text-sm font-medium">
                          {isFree ? "Free" : `${method.base_cost} EGP`}
                        </span>
                      </label>
                    );
                  })}
              </div>
            )}
          </section>

          {/* 3. Payment Method */}
          <section className="border rounded-lg p-4">
            <h2 className="font-semibold mb-3">Payment Method</h2>
            <div className="space-y-2">
              {(
                [
                  "credit_card",
                  "cash_on_delivery",
                  "vodafone_cash",
                ] as PaymentMethod[]
              ).map((m) => (
                <label
                  key={m}
                  className={`flex items-center gap-3 p-3 border rounded cursor-pointer
                    ${paymentMethod === m ? "border-primary bg-primary/5" : ""}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={m}
                    checked={paymentMethod === m}
                    onChange={() => setPaymentMethod(m)}
                  />
                  <div className="text-sm">
                    <p className="font-medium">
                      {m === "credit_card" && "Credit Card"}
                      {m === "cash_on_delivery" && "Cash on Delivery"}
                      {m === "vodafone_cash" && "Vodafone Cash"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {m === "credit_card" && "Pay securely with Stripe"}
                      {m === "cash_on_delivery" &&
                        "Pay when your order arrives at your doorstep"}
                      {m === "vodafone_cash" &&
                        `Send payment to ${import.meta.env.VITE_VODAFONE_CASH_NUMBER ?? "01000000000"}`}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* 4. Promo Code */}
          <section className="border rounded-lg p-4">
            <h2 className="font-semibold mb-3">Promo Code</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => {
                  setPromoCode(e.target.value.toUpperCase());
                  setPromoResult(null);
                  setPromoError("");
                }}
                placeholder="Enter promo code"
                className="flex-1 border rounded px-3 py-2 text-sm"
                disabled={!!promoResult}
              />
              {promoResult ? (
                <button
                  onClick={() => {
                    setPromoResult(null);
                    setPromoCode("");
                  }}
                  className="px-4 py-2 border rounded text-sm text-destructive"
                >
                  Remove
                </button>
              ) : (
                <button
                  onClick={handleApplyPromo}
                  disabled={isValidatingPromo || !promoCode.trim()}
                  className="px-4 py-2 bg-black text-white rounded text-sm disabled:opacity-50"
                >
                  {isValidatingPromo ? "..." : "Apply"}
                </button>
              )}
            </div>
            {promoError && (
              <p className="text-sm text-destructive mt-1">{promoError}</p>
            )}
            {promoResult && (
              <p className="text-sm text-green-600 mt-1">
                Discount applied: -{promoResult.discount} EGP
              </p>
            )}
          </section>

          {/* 5. Notes */}
          <section className="border rounded-lg p-4">
            <h2 className="font-semibold mb-3">Order Notes (Optional)</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special instructions?"
              rows={3}
              className="w-full border rounded px-3 py-2 text-sm resize-none"
            />
          </section>
        </div>

        {/* ===== Right: Summary ===== */}
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h2 className="font-semibold mb-4">Order Summary</h2>

            {/* Items */}
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {items?.map((item) => (
                <div key={item.id} className="flex gap-3">
                  {item.images?.[0] && (
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">
                      {item.name}
                    </p>
                    {item.variantName && (
                      <p className="text-xs text-muted-foreground">
                        {item.variantName}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      x{item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-medium">{item.lineTotal} EGP</p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t pt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{subtotal} EGP</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{discount} EGP</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>
                  {selectedShipping
                    ? shippingCost === 0
                      ? "Free"
                      : `${shippingCost} EGP`
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Tax ({(taxRate * 100).toFixed(0)}%)
                </span>
                <span>{tax} EGP</span>
              </div>
              <div className="flex justify-between font-bold text-base border-t pt-2">
                <span>Total</span>
                <span>{total.toFixed(2)} EGP</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder || !selectedAddress || !selectedShipping}
              className="w-full mt-4 bg-black text-white py-3 rounded-lg font-medium
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPlacingOrder ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
