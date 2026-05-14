import { useQuery } from "@tanstack/react-query";
import type { Product, ProductsFilter, ProductsResponse } from "./products.types";
import type { AxiosError } from "axios";
import type { ApiError, ApiSuccess } from "@/types/api.types";
import { getProductById, getProducts } from "./products.api";
import { getErrorMessage } from "@/lib/get-error-message";

export const useProducts = (filters?: ProductsFilter) => {
    const { data, isLoading, isError, error } = useQuery<ApiSuccess<ProductsResponse>, AxiosError<ApiError>>({
        queryKey: ['products', filters],
        queryFn: () => getProducts(filters),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
    const errorMessage = getErrorMessage(error);
    const successMessage = data?.message;
    return { products: data?.data?.products ?? [], pagination: data?.data?.pagination, isLoading, isError, errorMessage, successMessage };
}

export const useProductDetails = (id: string) => {
    const { data, isLoading, isError, error } = useQuery<ApiSuccess<Product>, AxiosError<ApiError>>({
        queryKey: ['product', id],
        queryFn: () => getProductById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
    const errorMessage = getErrorMessage(error);
    const successMessage = data?.message;
    return { product: data?.data, variants: data?.data?.variants, isLoading, isError, errorMessage, successMessage };
}