import { useMutation, useQuery } from "@tanstack/react-query";
import { getUserProfile, updateUserProfile } from "./users.api";
import type { ApiError, ApiSuccess } from "@/types/api.types";
import type { User } from "./users.types";
import type { AxiosError } from "axios";

export const useGetUserProfile = () => {
  const { data, error, isLoading } = useQuery<ApiSuccess<User>>({
    queryKey: ['user', 'profile'],
    queryFn: getUserProfile,
  });

  return { data: data?.data, error, isLoading };
}

export const useUpdateUserProfile = () => {
  const { mutate, data, error, isPending } = useMutation<ApiSuccess<User>, AxiosError<ApiError>, Partial<User>>({
    mutationKey: ['user', 'updateProfile'],
    mutationFn: (profileData: Partial<User>) => updateUserProfile(profileData),
  });

  return { mutate, data: data?.data, error, isPending };
}