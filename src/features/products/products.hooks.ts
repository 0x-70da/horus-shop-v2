import { useQuery } from "@tanstack/react-query";
import type { Product, ProductsFilter, ProductsResponse } from "./products.types";
import type { AxiosError } from "axios";
import type { ApiError, ApiSuccess } from "@/types/api.types";
import { getProductById, getProducts } from "./products.api";
import { getErrorMessage } from "@/lib/get-error-message";

export const useProducts = (id?: string, filters?: ProductsFilter) => {
    const { data: productsData, isLoading: isProductsLoading, isError: isProductsError, error: productsError } = useQuery<ApiSuccess<ProductsResponse>, AxiosError<ApiError>>({
        queryKey: ['products', filters],
        queryFn: () => getProducts(filters),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
    const productsErrorMessage = getErrorMessage(productsError);
    const productsSuccessMessage = productsData?.message;

    const { data: productData, isLoading: isProductLoading, isError: isProductError, error: productError } = useQuery<ApiSuccess<Product>, AxiosError<ApiError>>({
        queryKey: ['product', id],
        queryFn: () => getProductById(id!),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    const productErrorMessage = getErrorMessage(productError);
    const productSuccessMessage = productData?.message;

    return { 
      products: productsData?.data?.products ?? [], 
      pagination: productsData?.data?.pagination,
      isProductsLoading, 
      isProductsError, 
      productsErrorMessage, 
      productsSuccessMessage,
      product: productData?.data,
      productVariants: productData?.data?.variants,
      isProductLoading,
      isProductError,
      productErrorMessage,
      productSuccessMessage,
    };
}

