import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api.types";
import type {
  RegisterFormData,
  LoginFormData,
  ForgotPasswordFormData,
  VerifyCodeOrResetTokenFormData,
} from "./auth.schema";
import type { AuthUser, ResetPasswordRequest } from "./auth.types";
import { AxiosError } from "axios";

export const register = async (registerData: RegisterFormData) => {
  const { firstName, lastName, email, password } = registerData;

  const { data } = await api.post<ApiResponse>("/auth/register", {
    firstName,
    lastName,
    email,
    password,
  });

  if (!data.success) {
    throw new AxiosError(data.message);
  }

  return data;
};

export const login = async (loginData: LoginFormData) => {
  const { email, password } = loginData;

  const { data } = await api.post<ApiResponse<AuthUser>>("/auth/login", {
    email,
    password,
  });

  if (!data.success) {
    throw new AxiosError(data.message);
  }

  return data;
};

export const forgotPassword = async (
  forgotPasswordData: ForgotPasswordFormData,
) => {
  const { email } = forgotPasswordData;

  const { data } = await api.post<ApiResponse>("/auth/forgot-password", {
    email,
  });

  if (!data.success) {
    throw new AxiosError(data.message);
  }

  return data;
};

export const verifyCodeOrResetToken = async (
  verifyData: VerifyCodeOrResetTokenFormData,
) => {
  const { code, token } = verifyData;
  const { data } = await api.post<ApiResponse<{ resetToken: string }>>(
    "/auth/verify",
    code ? { code } : {},
    token ? { params: { token } } : undefined,
  );

  if (!data.success) {
    throw new AxiosError(data.message);
  }

  return data;
};

export const resetPassword = async (
  resetPasswordData: ResetPasswordRequest,
) => {
  const { resetToken, newPassword, confirmNewPassword } = resetPasswordData;

  const { data } = await api.post<ApiResponse>("/auth/reset-password", {
    resetToken,
    newPassword,
    confirmNewPassword,
  });

  if (!data.success) {
    throw new AxiosError(data.message);
  }

  return data;
};

export const getMe = async () => {
  const { data } = await api.get<ApiResponse<AuthUser>>("/auth/me");

  if (!data.success) {
    throw new AxiosError(data.message);
  }

  return data;
};

export const logout = async () => {
  const { data } = await api.post<ApiResponse>("/auth/logout");

  if (!data.success) {
    throw new AxiosError(data.message);
  }

  return data;
};
