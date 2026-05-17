import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addToWishlist,
  getWishlistItems,
  removeFromWishlist,
} from "./wishlist.api";
import { getErrorMessage } from "@/lib/get-error-message";
import type { ApiError, ApiSuccess } from "@/types/api.types";
import type { AxiosError } from "axios";
import type { WishlistItem } from "./wishlist.types";
import { toast } from "sonner";

export const useWishlist = () => {
  const queryClient = useQueryClient();

  const {
    data: wishlistItems,
    isLoading: isWishlistItemsLoading,
    isError: isWishlistItemsError,
    error: wishlistItemsError,
  } = useQuery<ApiSuccess<WishlistItem[]>, AxiosError<ApiError>>({
    queryKey: ["wishlist"],
    queryFn: getWishlistItems,
  });

  const wishlistItemsErrorMessage = getErrorMessage(wishlistItemsError);
  const wishlistItemsSuccessMessage = wishlistItems?.message;

  const {
    mutate: addToWishlistMutate,
    data: addToWishlistData,
    isPending: isAddToWishlistPending,
    isError: isAddToWishlistError,
    error: addToWishlistError,
  } = useMutation<
    ApiSuccess<WishlistItem>,
    AxiosError<ApiError>,
    { itemId: string }
  >({
    mutationKey: ["wishlist", "add"],
    mutationFn: ({ itemId }) => addToWishlist(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success("Item added to wishlist!");
    },
  });

  const addToWishlistErrorMessage = getErrorMessage(addToWishlistError);
  const addToWishlistSuccessMessage = addToWishlistData?.message;

  const {
    mutate: removeFromWishlistMutate,
    data: removeFromWishlistData,
    isPending: isRemoveFromWishlistPending,
    isError: isRemoveFromWishlistError,
    error: removeFromWishlistError,
  } = useMutation<ApiSuccess<null>, AxiosError<ApiError>, { itemId: string }>({
    mutationKey: ["wishlist", "remove"],
    mutationFn: ({ itemId }) => removeFromWishlist(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  const removeFromWishlistErrorMessage = getErrorMessage(
    removeFromWishlistError,
  );
  const removeFromWishlistSuccessMessage = removeFromWishlistData?.message;
  return {
    wishlistItems: wishlistItems?.data ?? [],
    isWishlistItemsLoading,
    isWishlistItemsError,
    wishlistItemsErrorMessage,
    wishlistItemsSuccessMessage,
    addToWishlist: addToWishlistMutate,
    isAddToWishlistPending,
    isAddToWishlistError,
    addToWishlistErrorMessage,
    addToWishlistSuccessMessage,
    removeFromWishlist: removeFromWishlistMutate,
    isRemoveFromWishlistPending,
    isRemoveFromWishlistError,
    removeFromWishlistErrorMessage,
    removeFromWishlistSuccessMessage,
  };
};
