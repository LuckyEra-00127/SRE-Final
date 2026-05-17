import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createHabit } from "../api/habits";
import ErrorMessage from "../components/ErrorMessage";
import HabitForm from "../components/HabitForm";
import { HabitCreate } from "../types/habit";
import { getFriendlyError } from "../utils/errors";

export default function CreateHabitPage() {
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (payload: HabitCreate) => {
    setSaving(true);
    setError(null);
    try {
      await createHabit(payload);
      navigate("/", { replace: true });
    } catch (err) {
      setError(getFriendlyError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to dashboard
        </Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">Create Habit</h1>
        <p className="mt-2 text-slate-500">Define a routine you can check in consistently.</p>
      </div>
      {error && <ErrorMessage message={error} />}
      <HabitForm submitLabel="Create habit" isSubmitting={saving} onSubmit={handleSubmit} />
    </div>
  );
}
