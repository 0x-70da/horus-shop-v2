import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { addToWishlist, getWishlistItems, removeFromWishlist } from "./wishlist.api"
import { getErrorMessage } from "@/lib/get-error-message";
import type { ApiError, ApiSuccess } from "@/types/api.types";
import type { AxiosError } from "axios";
import type { WishlistItem } from "./wishlist.types";
import { toast } from "sonner";

export const useGetWishlistItems = () => {
    const { data, isLoading, isError, error } = useQuery<ApiSuccess<WishlistItem[]>, AxiosError<ApiError>>({
        queryKey: ['wishlist'],
        queryFn: getWishlistItems,
    });

    const errorMessage = getErrorMessage(error);
    const successMessage = data?.message;
    return { wishlistItems: data?.data ?? [], isLoading, isError, errorMessage, successMessage };
}

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();
    const { mutate, data, isPending, isError, error } = useMutation<ApiSuccess<WishlistItem>, AxiosError<ApiError>, { itemId: string }>({
        mutationKey: ['wishlist', 'add'],
        mutationFn: ({ itemId }) => addToWishlist(itemId),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['wishlist'] });
          toast.success("Item added to wishlist!");
        }
    });

    const errorMessage = getErrorMessage(error);
    const successMessage = data?.message;
    return { mutate, isPending, isError, errorMessage, successMessage };
}

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();
    const { mutate, data, isPending, isError, error } = useMutation<ApiSuccess<null>, AxiosError<ApiError>, { itemId: string }>({
        mutationKey: ['wishlist', 'remove'],
        mutationFn: ({ itemId }) => removeFromWishlist(itemId),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['wishlist'] });
        }
    });

    const errorMessage = getErrorMessage(error);
    const successMessage = data?.message;
    return { mutate, isPending, isError, errorMessage, successMessage };
}