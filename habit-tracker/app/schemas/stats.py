from __future__ import annotations

import uuid

from pydantic import BaseModel, Field


class HabitStatsResponse(BaseModel):
    habit_id: uuid.UUID
    current_streak: int = Field(ge=0)
    longest_streak: int = Field(ge=0)
    completion_rate_30d: float = Field(ge=0, le=100)


class WeeklyHabitSummary(BaseModel):
    habit_id: uuid.UUID
    name: str
    days_completed_this_week: int = Field(ge=0)
    target_days: int = Field(ge=1)


class WeeklySummaryResponse(BaseModel):
    week: str
    habits: list[WeeklyHabitSummary]


class CalendarResponse(BaseModel):
    habit_id: uuid.UUID
    month: str
    days: dict[str, str]
    completion_rate: float = Field(ge=0, le=100)


class MonthlyActivityHabit(BaseModel):
    habit_id: uuid.UUID
    name: str


class MonthlyActivityCalendarResponse(BaseModel):
    month: str
    days: dict[str, list[MonthlyActivityHabit]]
