// stripe.types.ts
export interface PaymentPageState {
  clientSecret: string;
  orderId: string;
  total: number;
}
