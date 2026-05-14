import { useQuery } from "@tanstack/react-query"
import { getFlashDeals } from "./flash.api"
import { getErrorMessage } from "@/lib/get-error-message";

export const useFlashDeals = () => {
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ['flash-deals'],
    queryFn: getFlashDeals,
  });

  const errorMessage = getErrorMessage(error);
  const successMessage = data?.message;

  return { flashDeals: data?.data ?? [], isError, isLoading, errorMessage, successMessage };
}