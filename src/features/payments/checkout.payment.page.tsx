// features/orders/checkout.payment.page.tsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);

interface LocationState {
  clientSecret: string;
  orderId:      string;
  total:        number;
}

// ===== Payment Form =====
function PaymentForm({ orderId, total }: { orderId: string; total: number }) {
  const stripe   = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message ?? "Validation error");
      setLoading(false);
      return;
    }

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/payment/status?orderId=${orderId}`,
      },
    });

    if (confirmError) {
      setError(confirmError.message ?? "Payment failed");
      setLoading(false);
    }
    // لو نجح → Stripe بيعمل redirect تلقائي
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 p-3 rounded">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={!stripe || !elements || loading}
        className="w-full bg-black text-white py-3 rounded-lg font-medium
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Processing..." : `Pay ${total} EGP`}
      </button>
    </form>
  );
}

// ===== Payment Page =====
export default function CheckoutPaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state    = location.state as LocationState | null;

  useEffect(() => {
    if (!state?.clientSecret) {
      navigate("/cart", { replace: true });
    }
  }, [state, navigate]);

  if (!state?.clientSecret) return null;

  return (
    <div className="container max-w-md py-12">
      <h1 className="text-2xl font-bold mb-2">Complete Payment</h1>
      <p className="text-muted-foreground mb-8">
        Total: <span className="font-semibold text-foreground">{state.total} EGP</span>
      </p>

      <div className="border rounded-lg p-6">
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret: state.clientSecret,
            appearance: { theme: "stripe" },
          }}
        >
          <PaymentForm orderId={state.orderId} total={state.total} />
        </Elements>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-4">
        🔒 Secured by Stripe
      </p>
    </div>
  );
}