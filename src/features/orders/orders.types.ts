// features/orders/orders.types.ts

export type OrderStatus =
  | "pending" | "confirmed" | "processing"
  | "shipped" | "delivered" | "cancelled" | "refunded";

export type PaymentMethod =
  | "credit_card" | "cash_on_delivery" | "vodafone_cash";

export interface OrderItem {
  id:           string;
  product_id:   string | null;
  product_name: string;
  product_image: string | null;
  variant_name: string | null;
  unit_price:   number;
  quantity:     number;
  line_total:   number;
}

export interface Order {
  id:              string;
  order_number:    string;
  status:          OrderStatus;
  subtotal:        number;
  discount:        number;
  shipping:        number;
  tax:             number;
  total:           number;
  payment_method:  PaymentMethod;
  tracking_number: string | null;
  notes:           string | null;
  created_at:      string;
  updated_at:      string;
  address: {
    full_name:    string;
    address_line: string;
    city:         string;
    state:        string | null;
    country:      string;
    phone:        string | null;
    zip_code:     string | null;
  };
  shipping_method: {
    name:           string;
    carrier:        string;
    estimated_days: number;
  };
  promo_code: {
    code:  string;
    type:  string;
    value: number;
  } | null;
  items: OrderItem[];
}

export interface OrderSummary {
  id:           string;
  order_number: string;
  status:       OrderStatus;
  total:        number;
  created_at:   string;
  items:        OrderItem[];
}

export interface CreateOrderBody {
  addressId:        string;
  shippingMethodId: string;
  promoCode?:       string;
  paymentMethod:    PaymentMethod;
  notes?:           string;
}

export interface CreateOrderResponse {
  order_id:      string;
  order_number:  string;
  subtotal:      number;
  discount:      number;
  shipping:      number;
  tax:           number;
  total:         number;
  paymentMethod:      PaymentMethod;
  clientSecret:       string | null;
  requiresPayment:    boolean;
  paymentInstructions?: {
    phoneNumber: string;
    amount:      number;
    message:     string;
  };
}

export interface ShippingMethod {
  id:             string;
  name:           string;
  carrier:        string | null;
  base_cost:      number;
  free_above:     number | null;
  estimated_days: number;
  is_active:      boolean;
}

export interface PromoValidationResult {
  discount:   number;
  promoId:    string;
  promoType:  string;
  promoValue: number;
}

export interface OrdersResponse {
  orders: OrderSummary[];
  pagination: {
    page:       number;
    limit:      number;
    total:      number;
    totalPages: number;
  };
}