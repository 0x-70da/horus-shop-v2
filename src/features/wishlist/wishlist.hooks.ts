import { useMutation, useQuery } from "@tanstack/react-query"
import { addToWishlist, getWishlistItems, removeFromWishlist } from "./wishlist.api"
import { getErrorMessage } from "@/lib/get-error-message";
import type { ApiError, ApiSuccess } from "@/types/api.types";
import type { AxiosError } from "axios";
import type { WishlistItem } from "./wishlist.types";

export const useGetWishlistItems = () => {
    const { data, isLoading, isError, error } = useQuery<ApiSuccess<WishlistItem[]>, AxiosError<ApiError>>({
        queryKey: ['wishlist'],
        queryFn: getWishlistItems,
    });

    const errorMessage = getErrorMessage(error);
    const successMessage = data?.message;
    return { data: data?.data, isLoading, isError, errorMessage, successMessage };
}

export const useAddToWishlist = (productId: string) => {
    const { mutate, data, isPending, isError, error } = useMutation<ApiSuccess<WishlistItem>, AxiosError<ApiError>>({
        mutationKey: ['wishlist', 'add'],
        mutationFn: () => addToWishlist(productId),
    });

    const errorMessage = getErrorMessage(error);
    const successMessage = data?.message;
    return { mutate, isPending, isError, errorMessage, successMessage };
}

export const useRemoveFromWishlist = () => {
    const { mutate, data, isPending, isError, error } = useMutation<ApiSuccess<null>, AxiosError<ApiError>, { productId: string }>({
        mutationKey: ['wishlist', 'remove'],
        mutationFn: ({ productId }) => removeFromWishlist(productId),
    });

    const errorMessage = getErrorMessage(error);
    const successMessage = data?.message;
    return { mutate, isPending, isError, errorMessage, successMessage };
}