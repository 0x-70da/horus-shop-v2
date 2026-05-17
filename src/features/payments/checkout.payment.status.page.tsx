// features/orders/checkout.payment.status.page.tsx
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);

type Status = "loading" | "success" | "processing" | "failed";

export default function CheckoutPaymentStatusPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<Status>("loading");

  const orderId = searchParams.get("orderId");
  const clientSecret = searchParams.get("payment_intent_client_secret");

  useEffect(() => {
    if (!clientSecret) {
      setStatus("failed");
      return;
    }

    stripePromise.then((stripe) => {
      if (!stripe) return;
      stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
        switch (paymentIntent?.status) {
          case "succeeded":
            setStatus("success");
            break;
          case "processing":
            setStatus("processing");
            break;
          default:
            setStatus("failed");
        }
      });
    });
  }, [clientSecret]);

  if (status === "loading") {
    return (
      <div className="container max-w-md py-20 text-center">
        <p>Verifying payment...</p>
      </div>
    );
  }

  return (
    <div className="container max-w-md py-20 text-center space-y-4">
      {status === "success" && (
        <>
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-2xl">
            ✓
          </div>
          <h1 className="text-2xl font-bold">Payment Successful!</h1>
          <p className="text-muted-foreground">
            Your order has been confirmed.
          </p>
        </>
      )}

      {status === "processing" && (
        <>
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto text-2xl">
            ⏳
          </div>
          <h1 className="text-2xl font-bold">Payment Processing</h1>
          <p className="text-muted-foreground">We'll update you shortly.</p>
        </>
      )}

      {status === "failed" && (
        <>
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto text-2xl">
            ✕
          </div>
          <h1 className="text-2xl font-bold">Payment Failed</h1>
          <p className="text-muted-foreground">Something went wrong.</p>
        </>
      )}

      <div className="flex gap-3 justify-center pt-2">
        {orderId && (
          <Link
            to={`/orders/${orderId}`}
            className="bg-black text-white px-6 py-2 rounded-lg text-sm"
          >
            View Order
          </Link>
        )}
        <Link to="/products" className="border px-6 py-2 rounded-lg text-sm">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
