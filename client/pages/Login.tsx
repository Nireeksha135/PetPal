import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthCard from "@/components/AuthCard";
import FormField from "@/components/FormField";
import Button from "@/components/Button";
import { useAuth } from "@/context/AuthContext";
import { useAuthForm } from "@/hooks/useAuthForm";
import { loginSchema, LoginFormValues } from "@/utils/validation/authSchemas";

export default function Login() {
  const { login } = useAuth();
  const { serverError, isSubmitting, runSubmit } = useAuthForm();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    await runSubmit(async () => {
      await login(values);
      const redirectTo =
        (location.state as { from?: { pathname: string } })?.from
          ?.pathname ?? "/dashboard";
      navigate(redirectTo, { replace: true });
    }).catch(() => undefined);
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to keep caring for your pets"
      footer={
        <span className="text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </span>
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
        noValidate
      >
        {serverError && (
          <div className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {serverError}
          </div>
        )}

        <FormField
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <FormField
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />

        <Button type="submit" fullWidth isLoading={isSubmitting}>
          Sign in
        </Button>
      </form>
    </AuthCard>
  );
}
