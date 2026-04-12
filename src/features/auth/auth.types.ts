export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    phone?: string;
    avatar?: string;
    createdAt: string;
}

export type AuthUser = Omit<User, 'phone' | 'createdAt'>