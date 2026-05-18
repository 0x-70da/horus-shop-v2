import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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

    stripePromise
      .then((stripe) => {
        if (!stripe) {
          setStatus("failed");
          return;
        }
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
      })
      .catch(() => setStatus("failed"));
  }, [clientSecret]);

  if (status === "loading") {
    return (
      <div className="container max-w-md py-20 text-center flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-muted-foreground">Verifying your payment...</p>
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
          <p className="text-muted-foreground">
            Your payment is being processed. We'll update you shortly.
          </p>
        </>
      )}

      {status === "failed" && (
        <>
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto text-2xl">
            ✕
          </div>
          <h1 className="text-2xl font-bold">Payment Failed</h1>
          <p className="text-muted-foreground">
            Your payment didn't go through. You can try again or use a different
            payment method.
          </p>
        </>
      )}

      <div className="flex gap-3 justify-center pt-2">
        {orderId && (
          <Link to={`/orders/${orderId}`}>
            <Button variant="outline" size="sm">
              View Order
            </Button>
          </Link>
        )}
        {status === "failed" && (
          <Link to="/checkout">
            <Button size="sm">Try Again</Button>
          </Link>
        )}
        <Link to="/products">
          <Button variant="outline" size="sm">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}
