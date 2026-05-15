import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { verifyCodeOrResetTokenSchema, type VerifyCodeOrResetTokenFormData } from "../auth.schema"
import { useAuth } from "../auth.hooks"

const VerifyCodePage = () => {
  const { verify, isVerifyPending, isVerifyError, verifyErrorMessage } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(verifyCodeOrResetTokenSchema),
    defaultValues: {
      code: "",
    }
  });
  const onSubmit = (data: VerifyCodeOrResetTokenFormData) => {
    verify({ code: data.code });
  }
  return (
    <div className="container flex min-h-[80vh] items-center justify-center py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Verify Code</CardTitle>
          <CardDescription>Enter the code sent to your email</CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <Field>
                    <FieldLabel htmlFor="code">Code</FieldLabel>
                    <Input
                      {...register("code")} 
                      id="code" 
                      type="text"
                      placeholder="123456"
                      maxLength={6}
                    />
                    {errors.code && (
                      <FieldError>{errors.code.message}</FieldError>
                    )}
                  </Field>
                  {isVerifyError && <p className="text-sm text-red-500">{verifyErrorMessage}</p>}
              <Button type="submit" className="w-full" disabled={isVerifyPending}>
                Verify
              </Button>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Didn't receive code?
                </Link>
            </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default VerifyCodePage