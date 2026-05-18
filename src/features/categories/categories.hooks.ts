import { useQuery } from "@tanstack/react-query";
import { getAllBrands, getAllCategories } from "./categories.api";
import type { ApiError, ApiSuccess } from "@/types/api.types";
import type { Brand, Category } from "./categories.types";
import type { AxiosError } from "axios";
import { getErrorMessage } from "@/lib/get-error-message";

export const useCategories = () => {
  const { data, isLoading, isError, error, refetch } = useQuery<
    ApiSuccess<Category[]>,
    AxiosError<ApiError>
  >({
    queryKey: ["categories"],
    queryFn: getAllCategories,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: false,
  });
  const errorMessage = getErrorMessage(error);
  const successMessage = data?.message;
  return {
    categories: data?.data ?? [],
    isLoading,
    isError,
    errorMessage,
    successMessage,
    refetchCategories: refetch,
  };
};

export const useBrands = () => {
  const { data, isLoading, isError, error, refetch } = useQuery<
    ApiSuccess<Brand[]>,
    AxiosError<ApiError>
  >({
    queryKey: ["brands"],
    queryFn: getAllBrands,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: false,
  });
  const errorMessage = getErrorMessage(error);
  const successMessage = data?.message;
  return {
    brands: data?.data ?? [],
    isLoading,
    isError,
    errorMessage,
    successMessage,
    refetchBrands: refetch,
  };
};
