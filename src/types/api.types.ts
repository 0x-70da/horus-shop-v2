export interface ApiSuccess<T = undefined> {
    success: true;
    message: string;
    data?: T;
}

export interface ApiError {
    success: false;
    message: string;
}

export type ApiResponse<T = undefined> = ApiSuccess<T> | ApiError;