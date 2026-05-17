import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getHabits, updateHabit } from "../api/habits";
import ErrorMessage from "../components/ErrorMessage";
import HabitForm from "../components/HabitForm";
import LoadingSpinner from "../components/LoadingSpinner";
import { Habit, HabitCreate } from "../types/habit";
import { getFriendlyError } from "../utils/errors";

export default function EditHabitPage() {
  const { id } = useParams<{ id: string }>();
  const [habit, setHabit] = useState<Habit | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadHabit = async () => {
      setLoading(true);
      setError(null);
      try {
        const habits = await getHabits();
        const found = habits.find((item) => item.id === id) ?? null;
        if (!found) {
          setError("Habit not found.");
        }
        setHabit(found);
      } catch (err) {
        setError(getFriendlyError(err));
      } finally {
        setLoading(false);
      }
    };

    void loadHabit();
  }, [id]);

  const handleSubmit = async (payload: HabitCreate) => {
    if (!id) {
      setError("Habit id is missing.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await updateHabit(id, payload);
      navigate(`/habits/${id}`, { replace: true });
    } catch (err) {
      setError(getFriendlyError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Link to={id ? `/habits/${id}` : "/"} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">Edit Habit</h1>
        <p className="mt-2 text-slate-500">Update the habit name, description, or cadence.</p>
      </div>

      {error && <ErrorMessage message={error} />}
      {loading ? <LoadingSpinner label="Loading habit" /> : habit && <HabitForm initialHabit={habit} submitLabel="Save changes" isSubmitting={saving} onSubmit={handleSubmit} />}
    </div>
  );
}
