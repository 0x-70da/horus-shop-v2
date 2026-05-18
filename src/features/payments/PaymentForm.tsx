import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

interface PaymentFormProps {
  orderId: string;
  total: number;
}

export default function PaymentForm({ orderId, total }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!stripe || !elements) {
    return (
      <div className="space-y-4" role="status" aria-live="polite" aria-busy="true">
        <span className="sr-only">Loading payment form...</span>
        <Skeleton className="h-40 w-full rounded" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);
    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message ?? "Something went wrong");
      setIsLoading(false);
      return;
    }

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/payment/status?orderId=${orderId}`,
      },
    });

    if (confirmError) {
      const message =
        confirmError.type === "card_error" ||
        confirmError.type === "validation_error"
          ? (confirmError.message ?? "Payment failed")
          : "An unexpected error occurred. Please try again.";
      setError(message);
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement
        options={{
          layout: "tabs",
        }}
      />

      {error && (
        <div
          className="bg-destructive/10 border border-destructive/20 rounded-lg p-3"
          role="alert"
        >
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || !elements || isLoading}
        size="lg"
        className="w-full gap-2"
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {isLoading ? "Processing..." : `Pay ${total} EGP`}
      </Button>
    </form>
  );
}
