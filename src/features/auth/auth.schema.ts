import { z } from "zod"

export const RegisterSchema = z.object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long")
})

export const LoginSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long")
})

export type RegisterFormData = z.infer<typeof RegisterSchema>
export type LoginFormData = z.infer<typeof LoginSchema>