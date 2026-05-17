// features/orders/order-detail.page.tsx
import { useParams, useLocation, Link } from "react-router-dom";
import { useOrders } from "./orders.hooks";

const STATUS_STEPS = [
  { key: "pending", label: "Order Placed" },
  { key: "confirmed", label: "Confirmed" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  refunded: "bg-gray-100 text-gray-800",
};

export default function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const isNewOrder = location.state?.newOrder;
  const { order, isOrderLoading, cancelOrder } = useOrders(orderId!);

  if (isOrderLoading)
    return <p className="container py-20 text-center">Loading...</p>;
  if (!order)
    return (
      <div className="container py-20 text-center">
        <p>Order not found</p>
        <Link to="/orders" className="underline text-sm mt-2 block">
          Back to orders
        </Link>
      </div>
    );

  const currentStep = STATUS_STEPS.findIndex(
    (s) => s.key === order.data?.status,
  );
  const canCancel = ["pending", "confirmed"].includes(order.data?.status ?? "");
  const isFinalStatus = ["cancelled", "refunded"].includes(
    order.data?.status ?? "",
  );

  return (
    <div className="container py-8 max-w-3xl">
      {/* New Order Banner */}
      {isNewOrder && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-700 font-medium">
            🎉 Order placed successfully!
          </p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link
            to="/orders"
            className="text-sm text-muted-foreground hover:underline"
          >
            ← Back to orders
          </Link>
          <h1 className="text-xl font-bold mt-1">
            #{order.data?.order_number}
          </h1>
          <p className="text-sm text-muted-foreground">
            {new Date(order.data?.created_at ?? "").toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[order.data?.status || "pending"]}`}
          >
            {order.data?.status}
          </span>
          {canCancel && (
            <button
              onClick={() => cancelOrder(orderId!)}
              disabled={isOrderLoading}
              className="text-sm text-destructive border border-destructive px-3 py-1 rounded disabled:opacity-50"
            >
              {isOrderLoading ? "Cancelling..." : "Cancel"}
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {!isFinalStatus && (
        <div className="border rounded-lg p-4 mb-6">
          <div className="flex items-center">
            {STATUS_STEPS.map((step, i) => (
              <div
                key={step.key}
                className="flex items-center flex-1 last:flex-none"
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
                    ${i <= currentStep ? "bg-black text-white" : "bg-gray-100 text-gray-400"}`}
                  >
                    {i < currentStep ? "✓" : i + 1}
                  </div>
                  <span
                    className={`text-xs mt-1 text-center hidden sm:block
                    ${i <= currentStep ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {step.label}
                  </span>
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-1 ${i < currentStep ? "bg-black" : "bg-gray-200"}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="font-semibold">Items ({order.data?.items.length})</h2>
          {order.data?.items.map((item) => (
            <div key={item.id} className="flex gap-3 border rounded-lg p-3">
              {item.product_image && (
                <img
                  src={item.product_image}
                  alt={item.product_name}
                  className="w-16 h-16 object-cover rounded"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm line-clamp-1">
                  {item.product_name}
                </p>
                {item.variant_name && (
                  <p className="text-xs text-muted-foreground">
                    {item.variant_name}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {item.unit_price} EGP × {item.quantity}
                </p>
              </div>
              <p className="font-medium text-sm">{item.line_total} EGP</p>
            </div>
          ))}
        </div>

        {/* Right Side */}
        <div className="space-y-4">
          {/* Price Summary */}
          <div className="border rounded-lg p-4">
            <h2 className="font-semibold mb-3">Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{order.data?.subtotal} EGP</span>
              </div>
              {(order.data?.discount ?? 0) > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>
                    Discount
                    {order.data?.promo_code &&
                      ` (${order.data?.promo_code.code})`}
                  </span>
                  <span>-{order.data?.discount} EGP</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>
                  {order.data?.shipping === 0
                    ? "Free"
                    : `${order.data?.shipping} EGP`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>{order.data?.tax} EGP</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-2">
                <span>Total</span>
                <span>{order.data?.total} EGP</span>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="border rounded-lg p-4">
            <h2 className="font-semibold mb-2">Delivery Address</h2>
            <div className="text-sm text-muted-foreground space-y-0.5">
              <p className="font-medium text-foreground">
                {order.data?.address.full_name}
              </p>
              <p>{order.data?.address.address_line}</p>
              <p>
                {order.data?.address.city}
                {order.data?.address.state && `, ${order.data?.address.state}`}
              </p>
              <p>{order.data?.address.country}</p>
              {order.data?.address.phone && <p>{order.data?.address.phone}</p>}
            </div>
          </div>

          {/* Shipping */}
          <div className="border rounded-lg p-4">
            <h2 className="font-semibold mb-2">Shipping</h2>
            <div className="text-sm text-muted-foreground space-y-0.5">
              <p>{order.data?.shipping_method.name}</p>
              {order.data?.shipping_method.carrier && (
                <p>{order.data?.shipping_method.carrier}</p>
              )}
              <p>{order.data?.shipping_method.estimated_days} business days</p>
              {order.data?.tracking_number && (
                <p className="font-medium text-foreground mt-1">
                  Tracking: {order.data?.tracking_number}
                </p>
              )}
            </div>
          </div>

          {/* Payment */}
          <div className="border rounded-lg p-4">
            <h2 className="font-semibold mb-2">Payment</h2>
            <p className="text-sm text-muted-foreground capitalize">
              {order.data?.payment_method.replace(/_/g, " ")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
