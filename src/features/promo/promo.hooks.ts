import { useQuery } from "@tanstack/react-query";
import { getPromoBanners } from "./promo.api";
import { getErrorMessage } from "@/lib/get-error-message";

export const usePromoBanners = () => {
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ['promo-banners'],
    queryFn: getPromoBanners,
  });
  const errorMessage = getErrorMessage(error);
  const successMessage = data?.message;
  return { promoBanners: data?.data ?? [], isError, errorMessage, successMessage, isLoading };
}