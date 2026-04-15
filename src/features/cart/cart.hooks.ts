import { useMutation, useQuery } from "@tanstack/react-query"
import { addToCart, clearCart, getCartItems, removeFromCart, updateCartItem } from "./cart.api"
import type { CartItem } from "./cart.types"
import type { AxiosError } from "axios"
import type { ApiError, ApiSuccess } from "@/types/api.types"
import { getErrorMessage } from "@/lib/get-error-message"

export const useCart = () => {
    const { data, isLoading, isError, error } = useQuery<ApiSuccess<CartItem[]>, AxiosError<ApiError>>({
        queryKey: ['cart'],
        queryFn: getCartItems,
    });
    const errorMessage = getErrorMessage(error);
    const successMessage = data?.message;
    const items = data?.data;
    return { items, isLoading, isError, errorMessage, successMessage };
}

export const useAddToCart = () => {
    const { mutate, data, isPending, isError, error } = useMutation<ApiSuccess<CartItem>, AxiosError<ApiError>, { product_id: string; quantity: number }>({
        mutationKey: ['cart', 'add'],
        mutationFn: ({ product_id, quantity }) => addToCart(product_id, quantity),
    });

    const errorMessage = getErrorMessage(error);
    const successMessage = data?.message;

    return { mutate, isPending, isError, errorMessage, successMessage };
}

export const useUpdateCartItem = () => {
    const { mutate, data, isPending, isError, error } = useMutation<ApiSuccess<CartItem>, AxiosError<ApiError>, { cart_item_id: string; quantity: number }>({
        mutationKey: ['cart', 'update'],
        mutationFn: ({ cart_item_id, quantity }) => updateCartItem(cart_item_id, quantity),
    });

    const errorMessage = getErrorMessage(error);
    const successMessage = data?.message;

    return { mutate, isPending, isError, errorMessage, successMessage };
}

export const useRemoveFromCart = () => {
    const { mutate, data, isPending, isError, error } = useMutation<ApiSuccess, AxiosError<ApiError>, { cart_item_id: string }>({
        mutationKey: ['cart', 'remove'],
        mutationFn: ({ cart_item_id }) => removeFromCart(cart_item_id),
    });

    const errorMessage = getErrorMessage(error);
    const successMessage = data?.message;

    return { mutate, isPending, isError, errorMessage, successMessage };
}

export const useClearCart = () => {
    const { mutate, data, isPending, isError, error } = useMutation<ApiSuccess, AxiosError<ApiError>>({
        mutationKey: ['cart', 'clear'],
        mutationFn: clearCart,
    });

    const errorMessage = getErrorMessage(error);
    const successMessage = data?.message;
    
    return { mutate, isPending, isError, errorMessage, successMessage };
}