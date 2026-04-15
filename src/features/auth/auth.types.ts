export interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    phone?: string;
    avatar?: string;
    created_at: string;
}

export type AuthUser = Omit<User, 'phone' | 'created_at'>