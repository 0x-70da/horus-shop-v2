import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api.types";
import type { WishlistItem } from "./wishlist.types";

export const getWishlistItems = async () => {
    const { data } = await api.get<ApiResponse<WishlistItem[]>>('/wishlist');

    if (!data.success) {
        throw new Error(data.message);
    }

    return data;
}

export const addToWishlist = async (productId: string) => {
    const { data } = await api.post<ApiResponse<WishlistItem>>('/wishlist', {
        productId,
    });

    if (!data.success) {
        throw new Error(data.message);
    }
    
    return data;
}

export const removeFromWishlist = async (productId: string) => {
    const { data } = await api.delete<ApiResponse<null>>(`/wishlist/${productId}`);

    if (!data.success) {
        throw new Error(data.message);
    }
    
    return data;
}