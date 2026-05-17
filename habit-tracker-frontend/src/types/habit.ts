export type HabitFrequency = "daily" | "weekly";

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  frequency: HabitFrequency;
  created_at: string;
}

export interface HabitCreate {
  name: string;
  description?: string | null;
  frequency: HabitFrequency;
}

export interface HabitUpdate {
  name?: string;
  description?: string | null;
  frequency?: HabitFrequency;
}

export interface CheckInResponse {
  id: string;
  habit_id: string;
  date: string;
  created_at: string;
}
