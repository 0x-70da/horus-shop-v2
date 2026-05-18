import { useMutation, useQuery } from "@tanstack/react-query";
import { getUserProfile, updateUserProfile } from "./users.api";
import type { ApiError, ApiSuccess } from "@/types/api.types";
import type { User } from "./users.types";
import type { AxiosError } from "axios";
import { getErrorMessage } from "@/lib/get-error-message";
import { toast } from "sonner";

export const useUser = () => {
  const {
    data: getProfileData,
    isError: isGetProfileError,
    error: getProfileError,
    isLoading: isGetProfileLoading,
    refetch: refetchProfile,
  } = useQuery<ApiSuccess<User>, AxiosError<ApiError>>({
    queryKey: ["user", "profile"],
    queryFn: getUserProfile,
  });

  const getProfileErrorMessage = getErrorMessage(getProfileError);
  const getProfileSuccessMessage = getProfileData?.message;

  const {
    mutate: updateProfileMutate,
    data: updateProfileData,
    error: updateProfileError,
    isPending: isUpdateProfilePending,
  } = useMutation<ApiSuccess<User>, AxiosError<ApiError>, Partial<User>>({
    mutationKey: ["user", "updateProfile"],
    mutationFn: (profileData: Partial<User>) => updateUserProfile(profileData),
    onError: () => {
      toast.error("Failed to update profile. Please try again.");
    },
  });

  const updateProfileErrorMessage = getErrorMessage(updateProfileError);
  const updateProfileSuccessMessage = updateProfileData?.message;

  return {
    getProfileData: getProfileData?.data,
    getProfileError,
    isGetProfileLoading,
    isGetProfileError,
    getProfileErrorMessage,
    getProfileSuccessMessage,
    refetchProfile,
    updateProfile: updateProfileMutate,
    updateProfileData: updateProfileData?.data,
    updateProfileError,
    isUpdateProfilePending,
    updateProfileErrorMessage,
    updateProfileSuccessMessage,
  };
};
