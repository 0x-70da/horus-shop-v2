import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import StripeProvider from "./stripe.provider";
import PaymentForm from "./PaymentForm";
import type { PaymentPageState } from "./stripe.types";

export default function CheckoutPaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as PaymentPageState | null;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!state?.clientSecret) {
      navigate("/cart", { replace: true });
      return;
    }
    setReady(true);
  }, [state, navigate]);

  if (!state?.clientSecret || !ready) {
    return (
      <div className="container max-w-md py-12">
        <Skeleton className="mb-2 h-8 w-56" />
        <Skeleton className="mb-8 h-4 w-32" />
        <div className="rounded-lg border p-6 space-y-4">
          <Skeleton className="h-40 w-full rounded" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-md py-12">
      <h1 className="text-2xl font-bold mb-2">Complete Payment</h1>
      <p className="text-muted-foreground mb-8">
        Total:{" "}
        <span className="font-semibold text-foreground">{state.total} EGP</span>
      </p>

      <div className="border rounded-lg p-6">
        <StripeProvider clientSecret={state.clientSecret}>
          <PaymentForm orderId={state.orderId} total={state.total} />
        </StripeProvider>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-4">
        Secured by Stripe
      </p>
    </div>
  );
}
