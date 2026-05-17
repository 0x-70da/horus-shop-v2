import { api } from "@/lib/api";
import type { CartItem, CartResponse } from "./cart.types";
import type { ApiResponse } from "@/types/api.types";

export const getCartItems = async () => {
  const { data } = await api.get<ApiResponse<CartResponse>>("/cart");

  if (!data.success) {
    throw new Error(data.message);
  }

  return data;
};

export const addToCart = async (
  itemId: string,
  variantId: string | null = null,
  quantity: number = 1,
) => {
  const { data } = await api.post<ApiResponse<CartItem>>("/cart", {
    itemId,
    variantId,
    quantity,
  });

  if (!data.success) {
    throw new Error(data.message);
  }

  return data;
};

export const updateCartItem = async (itemId: string, quantity: number) => {
  if (quantity === 0) return removeFromCart(itemId);
  const { data } = await api.patch<ApiResponse<CartItem>>(`/cart/${itemId}`, {
    quantity,
  });

  if (!data.success) {
    throw new Error(data.message);
  }

  return data;
};

export const removeFromCart = async (itemId: string) => {
  const { data } = await api.delete<ApiResponse>(`/cart/${itemId}`);

  if (!data.success) {
    throw new Error(data.message);
  }

  return data;
};

export const clearCart = async () => {
  const { data } = await api.delete<ApiResponse>("/cart");

  if (!data.success) {
    throw new Error(data.message);
  }

  return data;
};
