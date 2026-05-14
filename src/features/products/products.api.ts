import { api } from "@/lib/api";
import type { Product, ProductsFilter, ProductsResponse } from "./products.types";
import type { ApiResponse } from "@/types/api.types";

export const getProducts = async (filters?: ProductsFilter) => {
    const { data } = await api.get<ApiResponse<ProductsResponse>>('/products', {
        params: filters
    });

    if (!data.success) {
        throw new Error(data.message);
    }

    return data;
}

export const getProductById = async (id: string) => {
    const { data } = await api.get<ApiResponse<Product>>(`/products/${id}`);

    if (!data.success) {
        throw new Error(data.message);
    }

    return data;
}