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
import { useEffect } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useAuth } from "../auth.hooks";
import { useForm } from "react-hook-form";
import {
  ResetPasswordSchema,
  type ResetPasswordFormData,
} from "../auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();

  const urlToken = params.get("token") ?? undefined;
  const resetToken = (location.state as { resetToken?: string } | null)
    ?.resetToken;

  const {
    resetPassword,
    isResetPasswordPending,
    isResetPasswordError,
    resetPasswordErrorMessage,
    verify,
    isVerifyPending,
  } = useAuth();

  useEffect(() => {
    if (urlToken) {
      verify({ token: urlToken });
    } else if (!resetToken) {
      navigate("/forgot-password", { replace: true });
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ResetPasswordSchema),
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    if (!resetToken) return;
    resetPassword({
      resetToken,
      newPassword: data.newPassword,
      confirmNewPassword: data.confirmNewPassword,
    });
  };

  if (isVerifyPending) {
    return (
      <div className="container flex min-h-[80vh] items-center justify-center py-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Verifying...</CardTitle>
            <CardDescription>
              Please wait while we verify your reset token
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container flex min-h-[80vh] items-center justify-center py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>
            Enter a new password for your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Field>
              <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
              <Input
                {...register("newPassword")}
                id="newPassword"
                type="password"
                placeholder="Enter your new password"
              />
              {errors.newPassword && (
                <FieldError>{errors.newPassword.message}</FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="confirmNewPassword">
                Confirm New Password
              </FieldLabel>
              <Input
                {...register("confirmNewPassword")}
                id="confirmNewPassword"
                type="password"
                placeholder="Confirm your new password"
              />
              {errors.confirmNewPassword && (
                <FieldError>{errors.confirmNewPassword.message}</FieldError>
              )}
            </Field>
            {isResetPasswordError && (
              <p className="text-sm text-red-500">
                {resetPasswordErrorMessage}
              </p>
            )}
            <div className="flex justify-end">
              <Link
                to="/login"
                className="text-sm text-primary hover:underline"
              >
                Back to Login
              </Link>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isResetPasswordPending}
            >
              Reset Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
