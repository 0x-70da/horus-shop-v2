import { api } from "@/lib/api"
import type { ApiResponse } from "@/types/api.types"
import type { FlashDeals } from "./flash.types"

export const getFlashDeals = async () => {
  const { data } = await api.get<ApiResponse<FlashDeals[]>>('/flash');
  if (!data.success) {
    throw new Error(data.message);
  }
  return data;
}