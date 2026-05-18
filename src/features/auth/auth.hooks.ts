import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  forgotPassword,
  getMe,
  login,
  logout,
  register,
  resetPassword,
  verifyCodeOrResetToken,
} from "./auth.api";
import { useLocation, useNavigate } from "react-router-dom";
import type {
  ForgotPasswordFormData,
  LoginFormData,
  RegisterFormData,
} from "./auth.schema";
import type { ApiError, ApiResponse, ApiSuccess } from "@/types/api.types";
import type { AuthUser, ResetPasswordRequest } from "./auth.types";
import type { AxiosError } from "axios";
import { getErrorMessage } from "@/lib/get-error-message";
import { toast } from "sonner";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state?.from?.pathname as string) ?? "/";

  const {
    mutate: registerMutate,
    data: registerData,
    isPending: isRegisterPending,
    isError: isRegisterError,
    error: registerError,
  } = useMutation<ApiSuccess, AxiosError<ApiError>, RegisterFormData>({
    mutationKey: ["auth", "register"],
    mutationFn: register,
    onSuccess: () => {
      toast.success("Registration successful! Please log in.");
      navigate("/login");
    },
  });
  const registerErrorMessage = getErrorMessage(registerError);
  const registerSuccessMessage = registerData?.message;

  const {
    mutate: loginMutate,
    data: loginData,
    isPending: isLoginPending,
    isError: isLoginError,
    error: loginError,
  } = useMutation<ApiSuccess<AuthUser>, AxiosError<ApiError>, LoginFormData>({
    mutationKey: ["auth", "login"],
    mutationFn: login,
    onSuccess: (response) => {
      if (!response.success) return;
      queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
      toast.success("Login successful!");
      navigate(redirectTo, { replace: true });
    },
  });
  const loginErrorMessage = getErrorMessage(loginError);
  const loginSuccessMessage = loginData?.message;

  const {
    mutate: forgotPasswordMutate,
    data: forgotPasswordData,
    isPending: isForgotPasswordPending,
    isError: isForgotPasswordError,
    error: forgotPasswordError,
  } = useMutation<ApiSuccess, AxiosError<ApiError>, ForgotPasswordFormData>({
    mutationKey: ["auth", "forgotPassword"],
    mutationFn: forgotPassword,
    onSuccess: (response) => {
      if (!response.success) return;
      toast.success(response.message);
      navigate("/verify-code");
    },
  });
  const forgotPasswordErrorMessage = getErrorMessage(forgotPasswordError);
  const forgotPasswordSuccessMessage = forgotPasswordData?.message;

  const {
    mutate: verifyMutate,
    data: verifyData,
    isPending: isVerifyPending,
    isError: isVerifyError,
    error: verifyError,
  } = useMutation<
    ApiSuccess<{ resetToken: string }>,
    AxiosError<ApiError>,
    { code?: string; token?: string }
  >({
    mutationKey: ["auth", "verify"],
    mutationFn: verifyCodeOrResetToken,
    onSuccess: (response) => {
      if (!response.success) return;
      toast.success(response.message);
      navigate("/reset-password", {
        state: { resetToken: response.data?.resetToken },
      });
    },
  });
  const verifyErrorMessage = getErrorMessage(verifyError);
  const verifySuccessMessage = verifyData?.message;

  const {
    mutate: resetPasswordMutate,
    data: resetPasswordData,
    isPending: isResetPasswordPending,
    isError: isResetPasswordError,
    error: resetPasswordError,
  } = useMutation<ApiSuccess, AxiosError<ApiError>, ResetPasswordRequest>({
    mutationKey: ["auth", "resetPassword"],
    mutationFn: resetPassword,
    onSuccess: (response) => {
      if (!response.success) return;
      toast.success(response.message);
      navigate("/login");
    },
    onError: () => {
      toast.error("Failed to reset password. Please try again.");
    }
  });
  const resetPasswordErrorMessage = getErrorMessage(resetPasswordError);
  const resetPasswordSuccessMessage = resetPasswordData?.message;

  const { data: userData, isLoading: isUserLoading } = useQuery<
    ApiSuccess<AuthUser>,
    AxiosError<ApiError>
  >({
    queryKey: ["auth", "user"],
    queryFn: getMe,
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
    networkMode: "offlineFirst",
  });

  const {
    mutate: logoutMutate,
    data: logoutData,
    isPending: isLogoutPending,
    isError: isLogoutError,
    error: logoutError,
  } = useMutation<ApiResponse, AxiosError<ApiError>, void>({
    mutationKey: ["auth", "logout"],
    mutationFn: logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["auth", "user"] });
      queryClient.removeQueries({ queryKey: ["cart"] });
      queryClient.removeQueries({ queryKey: ["wishlist"] });
      navigate("/login");
    },
  });
  const errorMessage = getErrorMessage(logoutError);
  const successMessage = logoutData?.message;

  return {
    registerUser: registerMutate,
    isRegisterPending,
    isRegisterError,
    registerErrorMessage,
    registerSuccessMessage,
    login: loginMutate,
    isLoginPending,
    isLoginError,
    loginErrorMessage,
    loginSuccessMessage,
    forgotPassword: forgotPasswordMutate,
    isForgotPasswordPending,
    isForgotPasswordError,
    forgotPasswordErrorMessage,
    forgotPasswordSuccessMessage,
    verify: verifyMutate,
    isVerifyPending,
    isVerifyError,
    verifyErrorMessage,
    verifySuccessMessage,
    resetPassword: resetPasswordMutate,
    isResetPasswordPending,
    isResetPasswordError,
    resetPasswordErrorMessage,
    resetPasswordSuccessMessage,
    user: userData?.data ?? null,
    isAuthenticated: !!userData?.data || false,
    isUserLoading,
    logout: logoutMutate,
    isLogoutPending,
    isLogoutError,
    logoutErrorMessage: errorMessage,
    logoutSuccessMessage: successMessage,
  };
};
