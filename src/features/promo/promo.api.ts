import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api.types";
import type { PromoBanners } from "./promo.types";

export const getPromoBanners = async () => {
  const { data } = await api.get<ApiResponse<PromoBanners[]>>("/promo");
  if (!data.success) {
    throw new Error(data.message);
  }
  return data;
};
