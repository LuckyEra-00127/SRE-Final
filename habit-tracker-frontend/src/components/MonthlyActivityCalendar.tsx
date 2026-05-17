import { ChevronLeft, ChevronRight } from "lucide-react";
import { MonthlyActivityCalendar as MonthlyActivityCalendarType } from "../types/stats";
import { formatMonthLabel, getMonthGridDates } from "../utils/dates";

interface MonthlyActivityCalendarProps {
  calendar: MonthlyActivityCalendarType;
  year: number;
  month: number;
  loading: boolean;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function MonthlyActivityCalendar({
  calendar,
  year,
  month,
  loading,
  onPreviousMonth,
  onNextMonth
}: MonthlyActivityCalendarProps) {
  const cells = getMonthGridDates(year, month);

  return (
    <section className="card p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Monthly Activity</h2>
          <p className="mt-1 text-sm text-slate-500">
            {formatMonthLabel(year, month)}. Completed habits are shown inside each day.
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={onPreviousMonth} className="btn-secondary px-3" aria-label="Previous month">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button type="button" onClick={onNextMonth} className="btn-secondary px-3" aria-label="Next month">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-7 gap-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-xs font-bold uppercase tracking-wide text-slate-500">
            {day}
          </div>
        ))}

        {cells.map((isoDate, index) => {
          if (!isoDate) {
            return <div key={`blank-${index}`} className="min-h-28" />;
          }

          const habits = calendar.days[isoDate] ?? [];
          const dayNumber = Number(isoDate.slice(-2));
          const hasHabits = habits.length > 0;

          return (
            <div
              key={isoDate}
              className={`min-h-28 rounded-lg border p-2 transition ${
                hasHabits ? "border-green-200 bg-green-50" : "border-slate-200 bg-slate-50"
              }`}
            >
              <div className={`text-sm font-bold ${hasHabits ? "text-green-800" : "text-slate-400"}`}>
                {dayNumber}
              </div>
              <div className="mt-2 space-y-1">
                {habits.map((habit) => (
                  <div
                    key={`${isoDate}-${habit.habit_id}`}
                    className="truncate rounded-md bg-white px-2 py-1 text-xs font-semibold text-green-800 shadow-sm ring-1 ring-green-100"
                    title={habit.name}
                  >
                    {habit.name}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {loading && <p className="mt-4 text-sm font-medium text-slate-500">Refreshing calendar...</p>}
    </section>
  );
}
