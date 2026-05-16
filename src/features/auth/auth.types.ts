export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
}

export type AuthUser = Omit<User, "phone" | "createdAt">;

export interface ResetPasswordRequest {
  resetToken: string;
  newPassword: string;
  confirmNewPassword: string;
}
