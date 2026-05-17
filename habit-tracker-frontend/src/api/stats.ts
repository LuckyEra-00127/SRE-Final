import { HabitStats, WeeklySummary } from "../types/stats";
import { apiClient } from "./axios";

export async function getHabitStats(id: string): Promise<HabitStats> {
  const response = await apiClient.get<HabitStats>(`/habits/${id}/stats`);
  return response.data;
}

export async function getWeeklySummary(): Promise<WeeklySummary> {
  const response = await apiClient.get<WeeklySummary>("/habits/summary/weekly");
  return response.data;
}
