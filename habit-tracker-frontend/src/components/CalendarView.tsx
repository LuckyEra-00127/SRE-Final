import { ChevronLeft, ChevronRight } from "lucide-react";
import { CalendarResponse } from "../types/stats";
import { formatMonthLabel, getMonthGridDates } from "../utils/dates";

interface CalendarViewProps {
  calendar: CalendarResponse;
  year: number;
  month: number;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const statusClasses = {
  done: "border-green-200 bg-green-50 text-green-800",
  missed: "border-red-200 bg-red-50 text-red-800",
  future: "border-slate-200 bg-slate-50 text-slate-400"
};

export default function CalendarView({ calendar, year, month, onPreviousMonth, onNextMonth }: CalendarViewProps) {
  const cells = getMonthGridDates(year, month);

  return (
    <section className="card p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{formatMonthLabel(year, month)}</h2>
          <p className="mt-1 text-sm text-slate-500">Monthly completion rate: {calendar.completion_rate}%</p>
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

      <div className="mt-5 grid grid-cols-7 gap-2 text-center">
        {weekDays.map((day) => (
          <div key={day} className="text-xs font-bold uppercase tracking-wide text-slate-500">
            {day}
          </div>
        ))}
        {cells.map((isoDate, index) => {
          if (!isoDate) {
            return <div key={`blank-${index}`} className="aspect-square" />;
          }

          const status = calendar.days[isoDate] ?? "future";
          const dayNumber = Number(isoDate.slice(-2));

          return (
            <div
              key={isoDate}
              className={`flex aspect-square min-h-10 items-center justify-center rounded-lg border text-sm font-bold ${statusClasses[status]}`}
              title={`${isoDate}: ${status}`}
            >
              {dayNumber}
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-600">
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-green-500" /> Done
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-500" /> Missed
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-slate-300" /> Future or not tracked
        </span>
      </div>
    </section>
  );
}
