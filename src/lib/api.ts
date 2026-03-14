import axios from 'axios';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10_000,
    withCredentials: true,
})