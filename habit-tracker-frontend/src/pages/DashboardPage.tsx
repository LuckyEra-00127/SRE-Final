import { BarChart3, CheckCircle2, PlusCircle, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMonthlyActivityCalendar } from "../api/habits";
import ErrorMessage from "../components/ErrorMessage";
import HabitCard from "../components/HabitCard";
import LoadingSpinner from "../components/LoadingSpinner";
import MonthlyActivityCalendar from "../components/MonthlyActivityCalendar";
import StatCard from "../components/StatCard";
import { useHabits } from "../hooks/useHabits";
import { Habit } from "../types/habit";
import { MonthlyActivityCalendar as MonthlyActivityCalendarType } from "../types/stats";
import { getCurrentYearMonth, shiftMonth } from "../utils/dates";
import { getFriendlyError } from "../utils/errors";

export default function DashboardPage() {
  const { habits, loading, error, refresh, remove, checkIn } = useHabits(true);
  const [busyCheckInId, setBusyCheckInId] = useState<string | null>(null);
  const [busyDeleteId, setBusyDeleteId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [yearMonth, setYearMonth] = useState(getCurrentYearMonth());
  const [monthlyCalendar, setMonthlyCalendar] = useState<MonthlyActivityCalendarType | null>(null);
  const [calendarLoading, setCalendarLoading] = useState(true);
  const [calendarError, setCalendarError] = useState<string | null>(null);

  const dailyCount = habits.filter((habit) => habit.frequency === "daily").length;
  const weeklyCount = habits.filter((habit) => habit.frequency === "weekly").length;

  const loadMonthlyCalendar = async (year = yearMonth.year, month = yearMonth.month) => {
    setCalendarLoading(true);
    setCalendarError(null);
    try {
      setMonthlyCalendar(await getMonthlyActivityCalendar(year, month));
    } catch (err) {
      setCalendarError(getFriendlyError(err));
    } finally {
      setCalendarLoading(false);
    }
  };

  useEffect(() => {
    void loadMonthlyCalendar(yearMonth.year, yearMonth.month);
  }, [yearMonth.month, yearMonth.year]);

  const moveMonth = (delta: number) => {
    setYearMonth((current) => shiftMonth(current.year, current.month, delta));
  };

  const handleCheckIn = async (habit: Habit) => {
    if (busyCheckInId) {
      return;
    }

    setBusyCheckInId(habit.id);
    setNotice(null);
    setActionError(null);
    try {
      await checkIn(habit.id);
      setNotice(`"${habit.name}" is checked in for today.`);
      await loadMonthlyCalendar();
    } catch (err) {
      setActionError(getFriendlyError(err));
    } finally {
      setBusyCheckInId(null);
    }
  };

  const handleDelete = async (habit: Habit) => {
    setBusyDeleteId(habit.id);
    setNotice(null);
    setActionError(null);
    try {
      await remove(habit.id);
      setNotice(`"${habit.name}" was deleted.`);
    } catch (err) {
      setActionError(getFriendlyError(err));
    } finally {
      setBusyDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="mt-2 text-slate-500">Track today, review your routines, and keep momentum visible.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button type="button" className="btn-secondary" onClick={() => void refresh()}>
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Refresh
          </button>
          <Link to="/habits/new" className="btn-primary">
            <PlusCircle className="h-4 w-4" aria-hidden="true" />
            New habit
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total habits" value={habits.length} icon={BarChart3} />
        <StatCard label="Daily habits" value={dailyCount} icon={CheckCircle2} accent="green" />
        <StatCard label="Weekly habits" value={weeklyCount} icon={RefreshCw} accent="gray" />
      </div>

      {notice && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
          {notice}
        </div>
      )}
      {actionError && <ErrorMessage message={actionError} />}
      {error && <ErrorMessage message={error} />}

      {loading ? (
        <LoadingSpinner label="Loading habits" />
      ) : habits.length === 0 ? (
        <section className="card p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
            <PlusCircle className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-slate-900">No habits yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Create your first habit and the dashboard will start showing check-ins, streaks, and progress.
          </p>
          <Link to="/habits/new" className="btn-primary mt-5">
            <PlusCircle className="h-4 w-4" aria-hidden="true" />
            Create habit
          </Link>
        </section>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onCheckIn={handleCheckIn}
              onDelete={handleDelete}
              checkInLoading={busyCheckInId === habit.id}
              deleteLoading={busyDeleteId === habit.id}
            />
          ))}
        </div>
      )}

      {calendarError && <ErrorMessage message={calendarError} />}
      {monthlyCalendar && (
        <MonthlyActivityCalendar
          calendar={monthlyCalendar}
          year={yearMonth.year}
          month={yearMonth.month}
          loading={calendarLoading}
          onPreviousMonth={() => moveMonth(-1)}
          onNextMonth={() => moveMonth(1)}
        />
      )}
    </div>
  );
}
