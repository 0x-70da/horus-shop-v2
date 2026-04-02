import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getMe, login, logout, register } from "./auth.api"
import { useLocation, useNavigate } from "react-router-dom"
import type { LoginFormData, RegisterFormData } from "./auth.schema"
import type { ApiError, ApiResponse } from "@/types/api.types"
import type { User } from "./auth.types"
import type { AxiosError } from "axios"
import { getErrorMessage } from "@/lib/get-error-message"

export const useRegister = () => {
    const navigate = useNavigate();
    const { mutate, isPending, isError, error } = useMutation<ApiResponse<User>, AxiosError<ApiError>, RegisterFormData>({
        mutationKey: ["auth", "register"],
        mutationFn: register,
        onSuccess: () => {
            navigate("/login");
        }
    });
    const errorMessage = getErrorMessage(error);
    return { mutate, isPending, isError, errorMessage };
}

export const useLogin = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const location = useLocation();

    const redirectTo = (location.state?.from?.pathname as string) ?? "/";

    const { mutate, isPending, isError, error } = useMutation<ApiResponse<User>, AxiosError<ApiError>, LoginFormData>({
        mutationKey: ["auth", "login"],
        mutationFn: login,
        onSuccess: (response) => {
            if(!response.success) return;
            queryClient.setQueryData(["auth", "user"], response.data);
            navigate(redirectTo, { replace: true });
        },
    });
    const errorMessage = getErrorMessage(error);
    return { mutate, isPending, isError, errorMessage };
}

export const useAuth = () => {
    const { data: user, isLoading } = useQuery<User, AxiosError<ApiError>>({
        queryKey: ["auth", "user"],
        queryFn: getMe,
        retry: false,
        staleTime: Infinity,
    });

    return {
        user: user ?? null,
        isAuthenticated: !!user,
        isLoading,
    }
}

export const useLogout = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { mutate, isPending, isError, error } = useMutation<ApiResponse, AxiosError<ApiError>, void>({
        mutationKey: ["auth", "logout"],
        mutationFn: logout,
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ["auth", "user"] });
            navigate("/login");
        },
    });
    const errorMessage = getErrorMessage(error);
    return { mutate, isPending, isError, errorMessage };
}