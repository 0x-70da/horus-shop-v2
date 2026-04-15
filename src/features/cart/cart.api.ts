import { api } from "@/lib/api"
import type { CartItem } from "./cart.types";
import type { ApiResponse } from "@/types/api.types";

export const getCartItems = async () => {
    const { data } = await api.get<ApiResponse<CartItem[]>>('/cart');

    if(!data.success) {
        throw new Error(data.message);
    }

    return data;
}

export const addToCart = async (productId: string, quantity: number = 1) => {
    const { data } = await api.post<ApiResponse<CartItem>>('/cart', {
        productId,
        quantity,
    });

    if(!data.success) {
        throw new Error(data.message);
    }

    return data;
}

export const updateCartItem = async (cartItemId: string, quantity: number) => {
    const { data } = await api.put<ApiResponse<CartItem>>(`/cart/${cartItemId}`, {
        quantity,
    });

    if(!data.success) {
        throw new Error(data.message);
    }

    return data;
}

export const removeFromCart = async (cartItemId: string) => {
    const { data } = await api.delete<ApiResponse>(`/cart/${cartItemId}`);

    if(!data.success) {
        throw new Error(data.message);
    }

    return data;
}

export const clearCart = async () => {
    const { data } = await api.delete<ApiResponse>('/cart');

    if(!data.success) {
        throw new Error(data.message);
    }

    return data;
}