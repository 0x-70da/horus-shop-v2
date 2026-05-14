import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { forgotPassword, getMe, login, logout, register, resetPassword, verifyCodeOrResetToken } from "./auth.api"
import { useLocation, useNavigate } from "react-router-dom"
import type { ForgotPasswordFormData, LoginFormData, RegisterFormData } from "./auth.schema"
import type { ApiError, ApiResponse, ApiSuccess } from "@/types/api.types"
import type { AuthUser, ResetPasswordRequest } from "./auth.types"
import type { AxiosError } from "axios"
import { getErrorMessage } from "@/lib/get-error-message"
import { toast } from "sonner"

export const useRegister = () => {
    const navigate = useNavigate();
    const { mutate, data, isPending, isError, error } = useMutation<ApiSuccess, AxiosError<ApiError>, RegisterFormData>({
        mutationKey: ["auth", "register"],
        mutationFn: register,
        onSuccess: () => {
            toast.success("Registration successful! Please log in.");
            navigate("/login");
        }
    });
    const errorMessage = getErrorMessage(error);
    const successMessage = data?.message;
    return { mutate, isPending, isError, errorMessage, successMessage };
}

export const useLogin = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const location = useLocation();

    const redirectTo = (location.state?.from?.pathname as string) ?? "/";

    const { mutate, data, isPending, isError, error } = useMutation<ApiSuccess<AuthUser>, AxiosError<ApiError>, LoginFormData>({
        mutationKey: ["auth", "login"],
        mutationFn: login,
        onSuccess: (response) => {
            if(!response.success) return;
            queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
            toast.success("Login successful!");
            navigate(redirectTo, { replace: true });
        },
    });
    const errorMessage = getErrorMessage(error);
    const successMessage = data?.message;
    return { mutate, isPending, isError, errorMessage, successMessage };
}

export const useForgotPassword = () => {
  const navigate = useNavigate();
  const { mutate, data, isPending, isError, error } = useMutation<ApiSuccess, AxiosError<ApiError>, ForgotPasswordFormData>({
      mutationKey: ["auth", "forgotPassword"],
      mutationFn: forgotPassword,
      onSuccess: (response) => {
          if(!response.success) return;
          toast.success(response.message);
          navigate("/verify-code");
      }
  });
  const errorMessage = getErrorMessage(error);
  const successMessage = data?.message;
  return { mutate, isPending, isError, errorMessage, successMessage };
}

export const useVerify = () => {
  const navigate = useNavigate();
  const { mutate, data, isPending, isError, error } = useMutation<ApiSuccess<{resetToken: string}>, AxiosError<ApiError>, { code?: string; token?: string}>({
      mutationKey: ["auth", "verify"],
      mutationFn: verifyCodeOrResetToken,
      onSuccess: (response) => {
          if(!response.success) return;
          toast.success(response.message);
          navigate("/reset-password", { state: { resetToken: response.data?.resetToken } });
      }
  });
  const errorMessage = getErrorMessage(error);
  const successMessage = data?.message;
  return { mutate, isPending, isError, errorMessage, successMessage };
}

export const useResetPassword = () => {
  const navigate = useNavigate();
  const { mutate, data, isPending, isError, error } = useMutation<ApiSuccess, AxiosError<ApiError>, ResetPasswordRequest>({
      mutationKey: ["auth", "resetPassword"],
      mutationFn: resetPassword,
      onSuccess: (response) => {
          if(!response.success) return;
          toast.success(response.message);
          navigate("/login");
      }
  });
  const errorMessage = getErrorMessage(error);
  const successMessage = data?.message;
  return { mutate, isPending, isError, errorMessage, successMessage };
}

export const useAuth = () => {
    const { data } = useQuery<ApiSuccess<AuthUser>, AxiosError<ApiError>>({
        queryKey: ["auth", "user"],
        queryFn: getMe,
        retry: false,
        staleTime: Infinity,
        gcTime: Infinity,
    });

    return {
        user: data?.data ?? null,
        isAuthenticated: !!data?.data || false,
    }
}

export const useLogout = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { mutate, data, isPending, isError, error } = useMutation<ApiResponse, AxiosError<ApiError>, void>({
        mutationKey: ["auth", "logout"],
        mutationFn: logout,
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ["auth", "user"] });
            navigate("/login");
        },
    });
    const errorMessage = getErrorMessage(error);
    const successMessage = data?.message;
    return { mutate, isPending, isError, errorMessage, successMessage };
}