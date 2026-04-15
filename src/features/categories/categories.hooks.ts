import { useQuery } from "@tanstack/react-query";
import { getAllCategories } from "./categories.api";
import type { ApiError, ApiSuccess } from "@/types/api.types";
import type { Category} from "./categories.types";
import type { AxiosError } from "axios";
import { getErrorMessage } from "@/lib/get-error-message";

export const useCategories = () => {
    const { data, isLoading, isError, error } = useQuery<ApiSuccess<Category[]>, AxiosError<ApiError>>({
        queryKey: ['categories'],
        queryFn: getAllCategories,
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        retry: false,
    });
    const errorMessage = getErrorMessage(error);
    const successMessage = data?.message;
    return { categories: data?.data, isLoading, isError, errorMessage, successMessage };
}