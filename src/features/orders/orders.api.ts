import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api.types";
import type {
  CreateOrderBody,
  CreateOrderResponse,
  Order,
  OrdersResponse,
  OrderStatus,
  PromoValidationResult,
  ShippingMethod,
} from "./orders.types";

export const getOrders = async (params: {
  page?: number;
  limit?: number;
  status?: OrderStatus;
}) => {
  const { data } = await api.get<ApiResponse<OrdersResponse>>("/orders", {
    params,
  });

  if (!data.success) {
    throw new Error(data.message);
  }

  return data;
};

export const getOrderById = async (id: string) => {
  const { data } = await api.get<ApiResponse<Order>>(`/orders/${id}`);

  if (!data.success) {
    throw new Error(data.message);
  }

  return data;
};

export const createOrder = async (body: CreateOrderBody) => {
  const { data } = await api.post<ApiResponse<CreateOrderResponse>>(
    "/orders",
    body,
  );

  if (!data.success) {
    throw new Error(data.message);
  }

  return data;
};

export const cancelOrder = async (orderId: string) => {
  const { data } = await api.post<ApiResponse>(`/orders/${orderId}/cancel`);

  if (!data.success) {
    throw new Error(data.message);
  }

  return data;
};

export const getShippingMethods = async () => {
  const { data } =
    await api.get<ApiResponse<ShippingMethod[]>>("/shipping-methods");

  if (!data.success) {
    throw new Error(data.message);
  }

  return data;
};

export const validatePromoCode = async (params: {
  code: string;
  orderTotal: number;
}) => {
  const { data } = await api.get<ApiResponse<PromoValidationResult>>(
    "/promo/validate",
    { params },
  );

  if (!data.success) {
    throw new Error(data.message);
  }

  return data;
};
