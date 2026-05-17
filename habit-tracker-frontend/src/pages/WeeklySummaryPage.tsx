import { CalendarRange, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { getWeeklySummary } from "../api/stats";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import ProgressBar from "../components/ProgressBar";
import { WeeklySummary } from "../types/stats";
import { getFriendlyError } from "../utils/errors";

export default function WeeklySummaryPage() {
  const [summary, setSummary] = useState<WeeklySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      setSummary(await getWeeklySummary());
    } catch (err) {
      setError(getFriendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSummary();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Weekly Summary</h1>
          <p className="mt-2 text-slate-500">Compare each habit against its target for the current week.</p>
        </div>
        <button type="button" className="btn-secondary" onClick={() => void loadSummary()}>
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Refresh
        </button>
      </div>

      {error && <ErrorMessage message={error} />}
      {loading ? (
        <LoadingSpinner label="Loading weekly summary" />
      ) : summary && summary.habits.length > 0 ? (
        <>
          <section className="card p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary-50 p-3 text-primary-700">
                <CalendarRange className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Current week</p>
                <h2 className="text-xl font-bold text-slate-900">{summary.week}</h2>
              </div>
            </div>
          </section>

          <div className="grid gap-4 md:grid-cols-2">
            {summary.habits.map((habit) => (
              <article key={habit.habit_id} className="card p-5">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{habit.name}</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {habit.days_completed_this_week} of {habit.target_days} target days completed
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700">
                    {habit.days_completed_this_week}/{habit.target_days}
                  </span>
                </div>
                <ProgressBar
                  value={habit.days_completed_this_week}
                  max={habit.target_days}
                  label="Weekly completion"
                />
              </article>
            ))}
          </div>
        </>
      ) : (
        <section className="card p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
            <CalendarRange className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-slate-900">No weekly data yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Create habits and check them in to see weekly progress here.
          </p>
        </section>
      )}
    </div>
  );
}
