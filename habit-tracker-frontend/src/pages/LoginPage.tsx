import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { loginUser } from "../api/auth";
import ErrorMessage from "../components/ErrorMessage";
import { useAuthStore } from "../store/authStore";
import { getFriendlyError } from "../utils/errors";

const authSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

type AuthFormValues = z.infer<typeof authSchema>;

interface RouteState {
  from?: {
    pathname?: string;
  };
}

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const location = useLocation();
  const routeState = location.state as RouteState | null;
  const redirectTo = routeState?.from?.pathname ?? "/";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: { email: "", password: "" }
  });

  const onSubmit = async (values: AuthFormValues) => {
    setError(null);
    try {
      const response = await loginUser(values);
      login(response.access_token);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(getFriendlyError(err));
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary-600 text-white shadow-sm">
            <LogIn className="h-6 w-6" aria-hidden="true" />
          </div>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-500">Sign in to continue tracking your habits.</p>
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
                autoComplete="current-password"
                className="input"
                {...register("password")}
              />
              {errors.password && <p className="mt-1.5 text-sm text-red-600">{errors.password.message}</p>}
            </div>
          </div>

          <button type="submit" className="btn-primary mt-6 w-full" disabled={isSubmitting}>
            <LogIn className="h-4 w-4" aria-hidden="true" />
            {isSubmitting ? "Signing in" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          New here?{" "}
          <Link to="/register" className="font-semibold text-primary-700 hover:text-primary-600">
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
}
