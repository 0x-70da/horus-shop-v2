import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getOrders,
  getOrderById,
  createOrder,
  cancelOrder,
  getShippingMethods,
  validatePromoCode,
} from "./orders.api";
import type { ApiError, ApiSuccess } from "@/types/api.types";
import type {
  CreateOrderBody,
  CreateOrderResponse,
  Order,
  OrdersResponse,
  OrderStatus,
  PromoValidationResult,
} from "./orders.types";
import type { AxiosError } from "axios";
import { toast } from "sonner";

export const useOrders = (
  id?: string,
  params?: { page?: number; limit?: number; status?: OrderStatus },
) => {
  const queryClient = useQueryClient();
  const {
    data: ordersResponse,
    isError: isOrdersError,
    error: ordersError,
    isLoading: isOrdersLoading,
  } = useQuery<ApiSuccess<OrdersResponse>, AxiosError<ApiError>>({
    queryKey: ["orders"],
    queryFn: () => getOrders(params ?? {}),
    enabled: !id,
  });

  const {
    data: order,
    isError: isOrderError,
    error: orderError,
    isLoading: isOrderLoading,
  } = useQuery<ApiSuccess<Order>, AxiosError<ApiError>>({
    queryKey: ["orders"],
    queryFn: () => getOrderById(id!),
    enabled: !!id,
  });

  const {
    mutateAsync: createOrderMutate,
    data: createOrderData,
    isError: isCreateOrderError,
    error: createOrderError,
    isPending: isCreateOrderLoading,
  } = useMutation<
    ApiSuccess<CreateOrderResponse>,
    AxiosError<ApiError>,
    CreateOrderBody
  >({
    mutationFn: (body: CreateOrderBody) => createOrder(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const {
    mutateAsync: cancelOrderMutate,
    data: cancelOrderData,
    isError: isCancelOrderError,
    error: cancelOrderError,
    isPending: isCancelOrderLoading,
  } = useMutation<ApiSuccess, AxiosError<ApiError>, string>({
    mutationFn: (orderId) => cancelOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order cancelled successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data.message || "Failed to cancel order");
    },
  });

  return {
    orders: ordersResponse?.data?.orders ?? [],
    pagination: ordersResponse?.data?.pagination,
    isOrdersLoading,
    isOrdersError,
    ordersError,
    order,
    isOrderLoading,
    isOrderError,
    orderError,
    createOrder: createOrderMutate,
    createOrderData,
    isCreateOrderLoading,
    isCreateOrderError,
    createOrderError,
    cancelOrder: cancelOrderMutate,
    cancelOrderData,
    isCancelOrderLoading,
    isCancelOrderError,
    cancelOrderError,
  };
};

export const useShippingMethods = () => {
  const {
    data,
    isError: isShippingError,
    error: shippingError,
    isLoading: isShippingLoading,
  } = useQuery({
    queryKey: ["shipping-methods"],
    queryFn: getShippingMethods,
    staleTime: Infinity,
  });

  return {
    shippingMethods: data?.data ?? [],
    isShippingError,
    isShippingLoading,
    shippingError,
  };
};

export const useValidatePromoCode = () => {
  const {
    mutateAsync: validatePromo,
    data: validationResult,
    isError: isPromoError,
    error: promoError,
    isPending: isValidatingPromo,
  } = useMutation<
    ApiSuccess<PromoValidationResult>,
    AxiosError<ApiError>,
    { code: string; orderTotal: number }
  >({
    mutationFn: ({ code, orderTotal }) =>
      validatePromoCode({ code, orderTotal }),
  });

  return {
    validatePromo,
    validationResult: validationResult?.data,
    isPromoError,
    promoError,
    isValidatingPromo,
  };
};
