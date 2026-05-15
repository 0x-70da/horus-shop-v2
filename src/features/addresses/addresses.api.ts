import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api.types";
import type { Address, CreateAddressBody, UpdateAddressBody } from "./addresses.types";

export const getAddresses = async () => {
  const { data } = await api.get<ApiResponse<Address[]>>('/addresses');

  if(!data.success) {
      throw new Error(data.message);
  }

  return data;
}

export const createAddress = async (body: CreateAddressBody) => {
  const { data } = await api.post<ApiResponse<Address>>('/addresses', body);

  if(!data.success) {
      throw new Error(data.message);
  }

  return data;
}

export const updateAddress = async (addressId: string, body: UpdateAddressBody) => {
  const { data } = await api.patch<ApiResponse<Address>>(`/addresses/${addressId}`, body);

  if(!data.success) {
      throw new Error(data.message);
  }

  return data;
}

export const deleteAddress = async (addressId: string) => {
  const { data } = await api.delete<ApiResponse<null>>(`/addresses/${addressId}`);

  if(!data.success) {
      throw new Error(data.message);
  }

  return data;
}