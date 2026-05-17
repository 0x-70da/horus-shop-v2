import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { RegisterSchema, type RegisterFormData } from "../auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../auth.hooks";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    registerUser,
    isRegisterPending,
    isRegisterError,
    registerErrorMessage,
  } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { firstName: "", lastName: "", email: "", password: "" },
  });
  const onSubmit = (data: RegisterFormData) => registerUser(data);

  return (
    <div className="container flex min-h-[80vh] items-center justify-center py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Join TechStore for exclusive deals</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel>First Name</FieldLabel>
                <Input {...register("firstName")} placeholder="John" />
                <FieldError>{errors.firstName?.message}</FieldError>
              </Field>
              <Field>
                <FieldLabel>Last Name</FieldLabel>
                <Input {...register("lastName")} placeholder="Doe" />
                <FieldError>{errors.lastName?.message}</FieldError>
              </Field>
            </div>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input
                {...register("email")}
                type="email"
                placeholder="you@example.com"
              />
              <FieldError>{errors.email?.message}</FieldError>
            </Field>
            <Field>
              <FieldLabel>Password</FieldLabel>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="••••••••"
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
              </div>
              <FieldError>{errors.password?.message}</FieldError>
              {isRegisterError && (
                <p className="text-sm text-red-500">{registerErrorMessage}</p>
              )}
              <Button
                type="submit"
                disabled={isRegisterPending}
                className="w-full"
              >
                Create Account
              </Button>
            </Field>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
