export interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
    avatar?: string;
    role: 'user' | 'admin';
    created_at: string;
}