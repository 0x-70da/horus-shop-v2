import { useQuery } from "@tanstack/react-query";
import type { ProductsFilter, ProductsResponse } from "./products.types";
import type { AxiosError } from "axios";
import type { ApiError, ApiSuccess } from "@/types/api.types";
import { getProducts } from "./products.api";
import { getErrorMessage } from "@/lib/get-error-message";

export const useProducts = (filters?: ProductsFilter) => {
    const { data, isLoading, isError, error } = useQuery<ApiSuccess<ProductsResponse>, AxiosError<ApiError>>({
        queryKey: ['products', 'category', filters],
        queryFn: () => getProducts(filters),
        // enabled: !!filters?.category,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
    const errorMessage = getErrorMessage(error);
    const successMessage = data?.message;
    return { data: data?.data?.products ?? [], pagination: data?.data?.pagination, isLoading, isError, errorMessage, successMessage };
}