export interface HabitStats {
  habit_id: string;
  current_streak: number;
  longest_streak: number;
  completion_rate_30d: number;
}

export interface WeeklySummaryHabit {
  habit_id: string;
  name: string;
  days_completed_this_week: number;
  target_days: number;
}

export interface WeeklySummary {
  week: string;
  habits: WeeklySummaryHabit[];
}

export type CalendarDayStatus = "done" | "missed" | "future";

export interface CalendarResponse {
  habit_id: string;
  month: string;
  days: Record<string, CalendarDayStatus>;
  completion_rate: number;
}

export interface MonthlyActivityHabit {
  habit_id: string;
  name: string;
}

export interface MonthlyActivityCalendar {
  month: string;
  days: Record<string, MonthlyActivityHabit[]>;
}
