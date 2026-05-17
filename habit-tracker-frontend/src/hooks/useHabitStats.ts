import { useCallback, useEffect, useState } from "react";
import { getHabitCalendar } from "../api/habits";
import { getHabitStats } from "../api/stats";
import { CalendarResponse, HabitStats } from "../types/stats";
import { getFriendlyError } from "../utils/errors";

export function useHabitStats(habitId: string | undefined, year: number, month: number) {
  const [stats, setStats] = useState<HabitStats | null>(null);
  const [calendar, setCalendar] = useState<CalendarResponse | null>(null);
  const [loading, setLoading] = useState(Boolean(habitId));
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!habitId) {
      setError("Habit id is missing.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [statsData, calendarData] = await Promise.all([
        getHabitStats(habitId),
        getHabitCalendar(habitId, year, month)
      ]);
      setStats(statsData);
      setCalendar(calendarData);
    } catch (err) {
      setError(getFriendlyError(err));
    } finally {
      setLoading(false);
    }
  }, [habitId, month, year]);

  useEffect(() => {
    void load();
  }, [load]);

  return { stats, calendar, loading, error, reload: load };
}
