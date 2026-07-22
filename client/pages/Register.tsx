import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthCard from "@/components/AuthCard";
import FormField from "@/components/FormField";
import Button from "@/components/Button";
import { useAuth } from "@/context/AuthContext";
import { useAuthForm } from "@/hooks/useAuthForm";
import {
  registerSchema,
  RegisterFormValues,
} from "@/utils/validation/authSchemas";

export default function Register() {
  const { register: registerUser } = useAuth();
  const { serverError, isSubmitting, runSubmit } = useAuthForm();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values: RegisterFormValues) => {
    await runSubmit(async () => {
      await registerUser({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
      });
      navigate("/dashboard", { replace: true });
    }).catch(() => undefined);
  };

  return (
    <AuthCard
      title="Create your account"
      subtitle="Start tracking your pet's health today"
      footer={
        <span className="text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
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
          label="Full name"
          type="text"
          autoComplete="name"
          placeholder="Jane Doe"
          error={errors.fullName?.message}
          {...register("fullName")}
        />

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
          autoComplete="new-password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />

        <FormField
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <Button type="submit" fullWidth isLoading={isSubmitting}>
          Create account
        </Button>
      </form>
    </AuthCard>
  );
}
