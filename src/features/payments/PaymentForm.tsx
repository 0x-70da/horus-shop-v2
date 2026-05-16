// payment-form.tsx
import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

interface PaymentFormProps {
  orderId: string;
  total: number;
}

export default function PaymentForm({ orderId, total }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);
    setError(null);

    // Validate الـ form الأول
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message ?? "Something went wrong");
      setIsLoading(false);
      return;
    }

    // Confirm الـ payment
    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/payment/status?orderId=${orderId}`,
      },
    });

    // لو وصلنا هنا = فيه error
    // لأن لو نجح Stripe بيعمل redirect تلقائي للـ return_url
    if (confirmError) {
      setError(
        confirmError.type === "card_error" ||
          confirmError.type === "validation_error"
          ? (confirmError.message ?? "Payment failed")
          : "An unexpected error occurred",
      );
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
        <div className="bg-red-50 border border-red-200 rounded p-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || !elements || isLoading}
        className="w-full bg-black text-white py-3 rounded-lg font-medium
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Processing..." : `Pay ${total} EGP`}
      </button>
    </form>
  );
}
