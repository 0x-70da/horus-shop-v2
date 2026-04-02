import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api.types";
import type { RegisterFormData, LoginFormData } from "./auth.schema";
import type { User } from "./auth.types";
import { AxiosError } from "axios";

export const register = async (registerData: RegisterFormData) => {
    const { firstName, lastName, email, password } = registerData;

    const { data } = await api.post<ApiResponse>("/auth/register", { firstName, lastName, email, password });

    if(!data.success) {
        throw new AxiosError(data.message);
    }

    return data;
}

export const login = async (loginData: LoginFormData) => {
    const { email, password } = loginData;

    const { data } = await api.post<ApiResponse<User>>("/auth/login", { email, password });

    if(!data.success) {
        throw new AxiosError(data.message);
    }

    return data;
}

export const getMe = async () => {
    const { data } = await api.get<ApiResponse<User>>("/auth/me");

    if(!data.success) {
        throw new AxiosError(data.message);
    }

    return data.data!;
}

export const logout = async () => {
    const { data } = await api.post<ApiResponse>("/auth/logout");

    if(!data.success) {
        throw new AxiosError(data.message);
    }

    return data;
}