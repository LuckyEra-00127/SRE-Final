import { useCallback, useEffect, useState } from "react";
import {
  checkInHabit,
  createHabit,
  deleteHabit,
  getHabits,
  updateHabit
} from "../api/habits";
import { Habit, HabitCreate, HabitUpdate } from "../types/habit";
import { getFriendlyError } from "../utils/errors";

export function useHabits(autoLoad = true) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(autoLoad);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getHabits();
      setHabits(data);
    } catch (err) {
      setError(getFriendlyError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoLoad) {
      void refresh();
    }
  }, [autoLoad, refresh]);

  const create = useCallback(async (payload: HabitCreate) => {
    const created = await createHabit(payload);
    setHabits((current) => [created, ...current]);
    return created;
  }, []);

  const update = useCallback(async (id: string, payload: HabitUpdate) => {
    const updated = await updateHabit(id, payload);
    setHabits((current) => current.map((habit) => (habit.id === id ? updated : habit)));
    return updated;
  }, []);

  const remove = useCallback(async (id: string) => {
    await deleteHabit(id);
    setHabits((current) => current.filter((habit) => habit.id !== id));
  }, []);

  const checkIn = useCallback(async (id: string) => {
    return checkInHabit(id);
  }, []);

  return { habits, loading, error, refresh, create, update, remove, checkIn };
}
