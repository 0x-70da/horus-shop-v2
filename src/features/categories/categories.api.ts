import { api } from "@/lib/api";
import type { Category } from "./categories.types";
import type { ApiResponse } from "@/types/api.types";

export const getAllCategories = async () => {
    const { data } = await api.get<ApiResponse<Category[]>>('/categories');

    if (!data.success) {
        throw new Error(data.message);
    }

    return data;
}