import { CalendarResponse, MonthlyActivityCalendar } from "../types/stats";
import { CheckInResponse, Habit, HabitCreate, HabitUpdate } from "../types/habit";
import { apiClient } from "./axios";

export async function getHabits(): Promise<Habit[]> {
  const response = await apiClient.get<Habit[]>("/habits");
  return response.data;
}

export async function createHabit(payload: HabitCreate): Promise<Habit> {
  const response = await apiClient.post<Habit>("/habits", payload);
  return response.data;
}

export async function updateHabit(id: string, payload: HabitUpdate): Promise<Habit> {
  const response = await apiClient.put<Habit>(`/habits/${id}`, payload);
  return response.data;
}

export async function deleteHabit(id: string): Promise<void> {
  await apiClient.delete(`/habits/${id}`);
}

export async function checkInHabit(id: string): Promise<CheckInResponse> {
  const response = await apiClient.post<CheckInResponse>(`/habits/${id}/checkin`);
  return response.data;
}

export async function getHabitCalendar(id: string, year: number, month: number): Promise<CalendarResponse> {
  const response = await apiClient.get<CalendarResponse>(`/habits/${id}/calendar`, {
    params: { year, month }
  });
  return response.data;
}

export async function getMonthlyActivityCalendar(year: number, month: number): Promise<MonthlyActivityCalendar> {
  const response = await apiClient.get<MonthlyActivityCalendar>("/habits/calendar/monthly", {
    params: { year, month }
  });
  return response.data;
}
