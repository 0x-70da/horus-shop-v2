import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { addToCart, clearCart, getCartItems, removeFromCart, updateCartItem } from "./cart.api"
import type { CartItem, CartResponse } from "./cart.types"
import type { AxiosError } from "axios"
import type { ApiError, ApiSuccess } from "@/types/api.types"
import { getErrorMessage } from "@/lib/get-error-message"
import { toast } from "sonner"

export const useCart = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery<ApiSuccess<CartResponse>, AxiosError<ApiError>>({
      queryKey: ['cart'],
      queryFn: getCartItems,
    });
    const getCartErrorMessage = getErrorMessage(error);
    const getCartSuccessMessage = data?.message;
    const items = data?.data?.cartItems;
    const subtotal = data?.data?.subtotal;
    const itemCount = data?.data?.itemCount;

    const { mutate: addToCartMutate, data: addToCartData, isPending: isAddingToCart, isError: isAddingToCartError, error: addToCartError } = useMutation<ApiSuccess<CartItem>, AxiosError<ApiError>, { itemId: string; variantId: string | null; quantity: number } >({
        mutationKey: ['cart', 'add'],
        mutationFn: ({ itemId, variantId = null, quantity }) => addToCart(itemId, variantId, quantity),
        onSuccess: () => {
          toast.success("Item added to cart!");
          queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
        onError: () => {
          toast.error("Failed to add item to cart. Please try again.");
        }
    });

    const addToCartErrorMessage = getErrorMessage(addToCartError);
    const addToCartSuccessMessage = addToCartData?.message;

    const { mutate: updateCartItemMutate, data: updateCartItemData, isPending: isUpdatingCartItem, isError: isUpdatingCartItemError, error: updateCartItemError } = useMutation<ApiSuccess<CartItem | undefined>, AxiosError<ApiError>, { itemId: string; quantity: number }>({
        mutationKey: ['cart', 'update'],
        mutationFn: ({ itemId, quantity }) => updateCartItem(itemId, quantity),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['cart'] });
        }
    });

    const updateCartItemErrorMessage = getErrorMessage(updateCartItemError);
    const updateCartItemSuccessMessage = updateCartItemData?.message;

    const { mutate: removeFromCartMutate, data: removeFromCartData, isPending: isRemovingFromCart, isError: isRemovingFromCartError, error: removeFromCartError } = useMutation<ApiSuccess, AxiosError<ApiError>, { itemId: string }>({
        mutationKey: ['cart', 'remove'],
        mutationFn: ({ itemId }) => removeFromCart(itemId),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['cart'] });
        }
    });

    const removeFromCartErrorMessage = getErrorMessage(removeFromCartError);
    const removeFromCartSuccessMessage = removeFromCartData?.message;

     const { mutate: clearCartMutate, data: clearCartData, isPending: isClearingCart, isError: isClearingCartError, error: clearCartError } = useMutation<ApiSuccess, AxiosError<ApiError>>({
        mutationKey: ['cart', 'clear'],
        mutationFn: clearCart,
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['cart'] });
        }
    });

    const clearCartErrorMessage = getErrorMessage(clearCartError);
    const clearCartSuccessMessage = clearCartData?.message;

    return { 
      items,
      isLoading, 
      isError, 
      getCartErrorMessage, 
      getCartSuccessMessage, 
      subtotal, 
      itemCount,
      addToCart: addToCartMutate,
      isAddingToCart,
      isAddingToCartError,
      addToCartErrorMessage,
      addToCartSuccessMessage,
      updateCartItem: updateCartItemMutate,
      isUpdatingCartItem,
      isUpdatingCartItemError,
      updateCartItemErrorMessage,
      updateCartItemSuccessMessage,
      removeFromCart: removeFromCartMutate,
      isRemovingFromCart,
      isRemovingFromCartError,
      removeFromCartErrorMessage,
      removeFromCartSuccessMessage,
      clearCart: clearCartMutate,
      isClearingCart,
      isClearingCartError,
      clearCartErrorMessage,
      clearCartSuccessMessage,
    };
}