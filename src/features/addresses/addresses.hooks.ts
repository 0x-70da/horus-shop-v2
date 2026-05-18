import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAddress,
  deleteAddress,
  getAddresses,
  setDefaultAddress,
  updateAddress,
} from "./addresses.api";
import type {
  Address,
  CreateAddressBody,
  UpdateAddressBody,
} from "./addresses.types";
import type { ApiError, ApiSuccess } from "@/types/api.types";
import type { AxiosError } from "axios";
import { toast } from "sonner";

export const useAddresses = (addressId?: string) => {
  const queryClient = useQueryClient();
  const {
    data,
    isError: isAddressesError,
    error: addressesError,
    isLoading: isAddressesLoading,
    refetch: refetchAddresses,
  } = useQuery({
    queryKey: ["addresses"],
    queryFn: getAddresses,
  });

  const {
    mutate: createAddressMutate,
    isPending: isCreatingAddress,
    isError: isCreatingAddressError,
    error: creatingAddressError,
  } = useMutation<ApiSuccess<Address>, AxiosError<ApiError>, CreateAddressBody>(
    {
      mutationKey: ["addresses"],
      mutationFn: (body: CreateAddressBody) => createAddress(body),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["addresses"] });
      },
      onError: () => {
        toast.error("Failed to create address. Please try again.");
      },
    },
  );

  const {
    mutate: updateAddressMutate,
    isPending: isUpdatingAddress,
    isError: isUpdatingAddressError,
    error: updatingAddressError,
  } = useMutation<ApiSuccess<Address>, AxiosError<ApiError>, UpdateAddressBody>(
    {
      mutationKey: ["addresses", "update"],
      mutationFn: (body: UpdateAddressBody) => updateAddress(addressId!, body),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["addresses"] });
      },
      onError: () => {
        toast.error("Failed to update address. Please try again.");
      },
    },
  );

  const {
    mutate: deleteAddressMutate,
    isPending: isDeletingAddress,
    isError: isDeletingAddressError,
    error: deletingAddressError,
  } = useMutation<ApiSuccess<null>, AxiosError<ApiError>, string>({
    mutationKey: ["addresses", "delete"],
    mutationFn: (addressId: string) => deleteAddress(addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
    onError: () => {
      toast.error("Failed to delete address. Please try again.");
    },
  });

  const {
    mutate: setDefaultAddressMutate,
    isPending: isSettingDefaultAddress,
    isError: isSettingDefaultAddressError,
    error: settingDefaultAddressError,
  } = useMutation<ApiSuccess<null>, AxiosError<ApiError>, string>({
    mutationKey: ["addresses", "setDefault"],
    mutationFn: (addressId: string) => setDefaultAddress(addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
    onError: () => {
      toast.error("Failed to set default address. Please try again.");
    },
  });

  return {
    addresses: data?.data ?? [],
    isAddressesError,
    addressesError,
    isAddressesLoading,
    refetchAddresses,
    createAddress: createAddressMutate,
    isCreatingAddress,
    isCreatingAddressError,
    creatingAddressError,
    updateAddress: updateAddressMutate,
    isUpdatingAddress,
    isUpdatingAddressError,
    updatingAddressError,
    deleteAddress: deleteAddressMutate,
    isDeletingAddress,
    isDeletingAddressError,
    deletingAddressError,
    setDefaultAddress: setDefaultAddressMutate,
    isSettingDefaultAddress,
    isSettingDefaultAddressError,
    settingDefaultAddressError,
  };
};
