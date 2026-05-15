import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field"
import { Link } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "../auth.hooks"
import { LoginSchema, type LoginFormData } from "../auth.schema"
import { zodResolver } from "@hookform/resolvers/zod"

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoginPending, isLoginError, loginErrorMessage } = useAuth();
  const { handleSubmit, register, formState: { errors } } = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = (data: LoginFormData) => login(data);
  return (
    <div className="container flex min-h-[80vh] items-center justify-center py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to your TechStore account</CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      {...register("email")} 
                      id="email" 
                      type="email"
                      placeholder="you@example.com"
                    />
                    {errors.email && (
                      <FieldError>{errors.email.message}</FieldError>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel>Password</FieldLabel>
                      <FieldContent className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...register("password")}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </FieldContent>
                      {errors.password && (
                        <FieldError>{errors.password.message}</FieldError>
                      )}
                  </Field>
              {isLoginError && <p className="text-sm text-red-500">{loginErrorMessage}</p>}
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Button type="submit" className="w-full" disabled={isLoginPending}>
                Sign In
              </Button>
            </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginPage