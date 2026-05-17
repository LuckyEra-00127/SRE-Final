import { ArrowLeft, CalendarDays, Edit, Flame, Percent, Trophy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { getHabits } from "../api/habits";
import CalendarView from "../components/CalendarView";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import StatCard from "../components/StatCard";
import { useHabitStats } from "../hooks/useHabitStats";
import { Habit } from "../types/habit";
import { formatDate, getCurrentYearMonth, shiftMonth } from "../utils/dates";
import { getFriendlyError } from "../utils/errors";

export default function HabitDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const initialMonth = getCurrentYearMonth();
  const [yearMonth, setYearMonth] = useState(initialMonth);
  const [habit, setHabit] = useState<Habit | null>(null);
  const [habitLoading, setHabitLoading] = useState(true);
  const [habitError, setHabitError] = useState<string | null>(null);
  const { stats, calendar, loading, error } = useHabitStats(id, yearMonth.year, yearMonth.month);

  useEffect(() => {
    const loadHabit = async () => {
      setHabitLoading(true);
      setHabitError(null);
      try {
        const habits = await getHabits();
        const found = habits.find((item) => item.id === id) ?? null;
        if (!found) {
          setHabitError("Habit not found.");
        }
        setHabit(found);
      } catch (err) {
        setHabitError(getFriendlyError(err));
      } finally {
        setHabitLoading(false);
      }
    };

    void loadHabit();
  }, [id]);

  const chartData = useMemo(
    () =>
      stats
        ? [
            { name: "Current", value: stats.current_streak },
            { name: "Longest", value: stats.longest_streak },
            { name: "30d %", value: stats.completion_rate_30d }
          ]
        : [],
    [stats]
  );

  const moveMonth = (delta: number) => {
    setYearMonth((current) => shiftMonth(current.year, current.month, delta));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to dashboard
          </Link>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{habit?.name ?? "Habit Details"}</h1>
          {habit && (
            <p className="mt-2 text-slate-500">
              {habit.frequency} habit created {formatDate(habit.created_at)}
            </p>
          )}
        </div>
        {id && (
          <Link to={`/habits/${id}/edit`} className="btn-secondary">
            <Edit className="h-4 w-4" aria-hidden="true" />
            Edit habit
          </Link>
        )}
      </div>

      {habitError && <ErrorMessage message={habitError} />}
      {error && <ErrorMessage message={error} />}
      {habitLoading || loading ? (
        <LoadingSpinner label="Loading habit details" />
      ) : (
        <>
          {habit && (
            <section className="card p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{habit.name}</h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                    {habit.description || "No description has been added for this habit."}
                  </p>
                </div>
                <span className="w-fit rounded-full bg-primary-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary-700">
                  {habit.frequency}
                </span>
              </div>
            </section>
          )}

          {stats && (
            <div className="grid gap-4 md:grid-cols-3">
              <StatCard label="Current streak" value={stats.current_streak} icon={Flame} accent="green" />
              <StatCard label="Longest streak" value={stats.longest_streak} icon={Trophy} />
              <StatCard label="30-day completion" value={`${stats.completion_rate_30d}%`} icon={Percent} accent="gray" />
            </div>
          )}

          {stats && (
            <section className="card p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-primary-50 p-2 text-primary-700">
                  <CalendarDays className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Performance Snapshot</h2>
                  <p className="text-sm text-slate-500">Streaks and completion rate from the API.</p>
                </div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip />
                    <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          )}

          {calendar && (
            <CalendarView
              calendar={calendar}
              year={yearMonth.year}
              month={yearMonth.month}
              onPreviousMonth={() => moveMonth(-1)}
              onNextMonth={() => moveMonth(1)}
            />
          )}
        </>
      )}
    </div>
  );
}
