// features/orders/orders.page.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Loading } from "@/components/ui/loading";
import { useOrders } from "./orders.hooks";
import type { OrderStatus } from "./orders.types";

const STATUS_TABS: { label: string; value: OrderStatus | undefined }[] = [
  { label: "All",        value: undefined },
  { label: "Pending",    value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Shipped",    value: "shipped" },
  { label: "Delivered",  value: "delivered" },
  { label: "Cancelled",  value: "cancelled" },
];

const STATUS_COLORS: Record<string, string> = {
  pending:    "bg-yellow-100 text-yellow-800",
  confirmed:  "bg-blue-100 text-blue-800",
  processing: "bg-blue-100 text-blue-800",
  shipped:    "bg-purple-100 text-purple-800",
  delivered:  "bg-green-100 text-green-800",
  cancelled:  "bg-red-100 text-red-800",
  refunded:   "bg-gray-100 text-gray-800",
};

export default function OrdersPage() {
  const [activeStatus, setActiveStatus] = useState<OrderStatus | undefined>();
  const [page, setPage] = useState(1);

  const { orders, pagination, isOrdersLoading, isOrdersError } = useOrders("", {
    status: activeStatus,
    page,
    limit: 10,
  });

  return (
    <div className="container py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {/* Tabs */}
      <div className="flex gap-1 border-b mb-6 overflow-x-auto">
        {STATUS_TABS.map(tab => (
          <button
            key={tab.label}
            onClick={() => { setActiveStatus(tab.value); setPage(1); }}
            className={`px-4 py-2 text-sm whitespace-nowrap transition-colors
              ${activeStatus === tab.value
                ? "border-b-2 border-black font-medium"
                : "text-muted-foreground"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* States */}
      {isOrdersLoading && <Loading />}
      {isOrdersError   && <p className="text-center py-10 text-destructive">Failed to load orders</p>}
      {!isOrdersLoading && !isOrdersError && orders.length === 0 && (
        <p className="text-center py-10 text-muted-foreground">No orders found</p>
      )}

      {/* Orders */}
      <div className="space-y-3">
        {orders.map(order => (
          <Link
            to={`/orders/${order.id}`}
            key={order.id}
            className="block border rounded-lg p-4 hover:border-gray-400 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-sm">#{order.order_number}</span>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[order.status]}`}>
                {order.status}
              </span>
            </div>

            {/* Item thumbnails */}
            <div className="flex gap-2 mb-3">
              {order.items.slice(0, 4).map((item, i) => (
                item.product_image && (
                  <img
                    key={i}
                    src={item.product_image}
                    alt={item.product_name}
                    className="w-12 h-12 object-cover rounded border"
                  />
                )
              ))}
              {order.items.length > 4 && (
                <div className="w-12 h-12 border rounded flex items-center justify-center text-xs text-muted-foreground">
                  +{order.items.length - 4}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {new Date(order.created_at).toLocaleDateString()}
              </span>
              <span className="font-bold">{order.total} EGP</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: pagination.totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={`w-8 h-8 rounded text-sm
                ${page === i + 1 ? "bg-black text-white" : "border"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}