import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { registerUser } from "../api/auth";
import ErrorMessage from "../components/ErrorMessage";
import { useAuthStore } from "../store/authStore";
import { getFriendlyError } from "../utils/errors";

const registerSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "" }
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setError(null);
    try {
      const response = await registerUser(values);
      login(response.access_token);
      navigate("/", { replace: true });
    } catch (err) {
      setError(getFriendlyError(err));
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary-600 text-white shadow-sm">
            <UserPlus className="h-6 w-6" aria-hidden="true" />
          </div>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900">Create your account</h1>
          <p className="mt-2 text-sm text-slate-500">Start building a consistent routine today.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="card p-6">
          <div className="space-y-5">
            {error && <ErrorMessage message={error} />}

            <div>
              <label htmlFor="email" className="label">
                Email
              </label>
              <input id="email" type="email" autoComplete="email" className="input" {...register("email")} />
              {errors.email && <p className="mt-1.5 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                className="input"
                {...register("password")}
              />
              {errors.password && <p className="mt-1.5 text-sm text-red-600">{errors.password.message}</p>}
            </div>
          </div>

          <button type="submit" className="btn-primary mt-6 w-full" disabled={isSubmitting}>
            <UserPlus className="h-4 w-4" aria-hidden="true" />
            {isSubmitting ? "Creating account" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary-700 hover:text-primary-600">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
