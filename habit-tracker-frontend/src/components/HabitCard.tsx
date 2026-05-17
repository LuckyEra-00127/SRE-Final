import { CalendarCheck, Edit, Eye, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Habit } from "../types/habit";
import { formatDate } from "../utils/dates";

interface HabitCardProps {
  habit: Habit;
  onCheckIn: (habit: Habit) => Promise<void>;
  onDelete: (habit: Habit) => Promise<void>;
  checkInLoading: boolean;
  deleteLoading: boolean;
}

export default function HabitCard({
  habit,
  onCheckIn,
  onDelete,
  checkInLoading,
  deleteLoading
}: HabitCardProps) {
  const handleDelete = async () => {
    if (window.confirm(`Delete "${habit.name}"? This will remove its check-ins too.`)) {
      await onDelete(habit);
    }
  };

  return (
    <article className="card flex h-full flex-col p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{habit.name}</h2>
          <p className="mt-1 text-sm text-slate-500">Created {formatDate(habit.created_at)}</p>
        </div>
        <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary-700">
          {habit.frequency}
        </span>
      </div>

      <p className="mt-4 min-h-12 flex-1 text-sm leading-6 text-slate-600">{habit.description || ""}</p>

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        <button type="button" className="btn-primary" disabled={checkInLoading} onClick={() => onCheckIn(habit)}>
          <CalendarCheck className="h-4 w-4" aria-hidden="true" />
          {checkInLoading ? "Checking in" : "Check in today"}
        </button>
        <Link to={`/habits/${habit.id}`} className="btn-secondary">
          <Eye className="h-4 w-4" aria-hidden="true" />
          Details
        </Link>
        <Link to={`/habits/${habit.id}/edit`} className="btn-secondary">
          <Edit className="h-4 w-4" aria-hidden="true" />
          Edit
        </Link>
        <button type="button" className="btn-danger" disabled={deleteLoading} onClick={handleDelete}>
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          {deleteLoading ? "Deleting" : "Delete"}
        </button>
      </div>
    </article>
  );
}
