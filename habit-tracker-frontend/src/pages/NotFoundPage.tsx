import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function NotFoundPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const destination = isAuthenticated ? "/" : "/login";

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="card w-full max-w-lg p-8 text-center">
        <p className="text-sm font-bold uppercase tracking-wide text-primary-700">404</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          The page you are looking for does not exist or may have been moved.
        </p>
        <Link to={destination} className="btn-primary mt-6">
          <Home className="h-4 w-4" aria-hidden="true" />
          Go home
        </Link>
      </section>
    </main>
  );
}
