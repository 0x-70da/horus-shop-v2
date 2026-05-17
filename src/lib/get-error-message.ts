import { isAxiosError } from "axios";

export const getErrorMessage = (error: unknown): string => {
  if (isAxiosError(error)) {
    return error.response?.data?.message ?? "Something went wrong.";
  }

  if (error instanceof Error) {
    return error.message;
  }
  return "An unknown error occurred.";
};
