import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { ForgotPasswordSchema, type ForgotPasswordFormData } from "../auth.schema"
import { useForgotPassword } from "../auth.hooks"

const ForgotPasswordPage = () => {
    const { mutate: forgotPassword, isError, errorMessage, isPending } = useForgotPassword();
    const { handleSubmit, register, formState: { errors } } = useForm({
      resolver: zodResolver(ForgotPasswordSchema),
      defaultValues: {
        email: "",
      },
    });
    const onSubmit = (data: ForgotPasswordFormData) => forgotPassword(data);

  return (
    <div className="container flex min-h-[80vh] items-center justify-center py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Forgot Password?</CardTitle>
          <CardDescription>Enter your email to reset your password</CardDescription>
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
              {isError && <p className="text-sm text-red-500">{errorMessage}</p>}
              <div className="flex justify-end">
                <Link
                  to="/login"
                  className="text-sm text-primary hover:underline"
                >
                  Back to login
                </Link>
              </div>
              <Button type="submit" className="w-full" disabled={isPending}>
                Reset Password
              </Button>
            </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default ForgotPasswordPage