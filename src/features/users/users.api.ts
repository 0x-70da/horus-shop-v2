import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api.types";
import type { User } from "./users.types";

export const getUserProfile = async () => {
  const { data } = await api.get<ApiResponse<User>>("/users/profile");

  if (!data.success) {
    throw new Error(data.message);
  }

  return data;
};

export const updateUserProfile = async (profileData: Partial<User>) => {
  const { data } = await api.patch<ApiResponse<User>>(
    "/users/profile",
    profileData,
  );

  if (!data.success) {
    throw new Error(data.message);
  }

  return data;
};
