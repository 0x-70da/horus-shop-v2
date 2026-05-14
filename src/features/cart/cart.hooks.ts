import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { addToCart, clearCart, getCartItems, removeFromCart, updateCartItem } from "./cart.api"
import type { CartItem, CartResponse } from "./cart.types"
import type { AxiosError } from "axios"
import type { ApiError, ApiSuccess } from "@/types/api.types"
import { getErrorMessage } from "@/lib/get-error-message"
import { toast } from "sonner"

export const useCart = () => {
    const { data, isLoading, isError, error } = useQuery<ApiSuccess<CartResponse>, AxiosError<ApiError>>({
        queryKey: ['cart'],
        queryFn: getCartItems,
    });
    const errorMessage = getErrorMessage(error);
    const successMessage = data?.message;
    const items = data?.data?.cartItems;
    const subtotal = data?.data?.subtotal;
    const itemCount = data?.data?.itemCount;
    return { items, isLoading, isError, errorMessage, successMessage, subtotal, itemCount };
}

export const useAddToCart = () => {
  const queryClient = useQueryClient();
    const { mutate, data, isPending, isError, error } = useMutation<ApiSuccess<CartItem>, AxiosError<ApiError>, { itemId: string; variantId: string | null; quantity: number }>({
        mutationKey: ['cart', 'add'],
        mutationFn: ({ itemId, variantId = null, quantity }) => addToCart(itemId, variantId, quantity),
        onSuccess: () => {
          toast.success("Item added to cart!");
          queryClient.invalidateQueries({ queryKey: ['cart'] });
        }
    });

    const errorMessage = getErrorMessage(error);
    const successMessage = data?.message;

    return { mutate, isPending, isError, errorMessage, successMessage };
}

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
    const { mutate, data, isPending, isError, error } = useMutation<ApiSuccess<CartItem | undefined>, AxiosError<ApiError>, { itemId: string; quantity: number }>({
        mutationKey: ['cart', 'update'],
        mutationFn: ({ itemId, quantity }) => updateCartItem(itemId, quantity),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['cart'] });
        }
    });

    const errorMessage = getErrorMessage(error);
    const successMessage = data?.message;

    return { mutate, isPending, isError, errorMessage, successMessage };
}

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
    const { mutate, data, isPending, isError, error } = useMutation<ApiSuccess, AxiosError<ApiError>, { itemId: string }>({
        mutationKey: ['cart', 'remove'],
        mutationFn: ({ itemId }) => removeFromCart(itemId),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['cart'] });
        }
    });

    const errorMessage = getErrorMessage(error);
    const successMessage = data?.message;

    return { mutate, isPending, isError, errorMessage, successMessage };
}

export const useClearCart = () => {
  const queryClient = useQueryClient();
    const { mutate, data, isPending, isError, error } = useMutation<ApiSuccess, AxiosError<ApiError>>({
        mutationKey: ['cart', 'clear'],
        mutationFn: clearCart,
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['cart'] });
        }
    });

    const errorMessage = getErrorMessage(error);
    const successMessage = data?.message;
    
    return { mutate, isPending, isError, errorMessage, successMessage };
}