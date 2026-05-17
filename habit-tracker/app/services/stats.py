from __future__ import annotations

import json
import uuid
from collections import defaultdict
from datetime import date, datetime, timedelta, timezone

from redis.asyncio import Redis
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.checkin import CheckIn
from app.models.habit import Habit, HabitFrequency
from app.services.habits import get_habit_for_user, list_habits

CACHE_TTL_SECONDS = 300


def _daterange(start: date, end: date) -> list[date]:
    if start > end:
        return []
    return [start + timedelta(days=offset) for offset in range((end - start).days + 1)]


def _week_start(day: date) -> date:
    return day - timedelta(days=day.weekday())


def _daily_current_streak(completed_dates: set[date], habit_start: date, today: date) -> int:
    cursor = today if today in completed_dates else today - timedelta(days=1)
    streak = 0
    while cursor >= habit_start and cursor in completed_dates:
        streak += 1
        cursor -= timedelta(days=1)
    return streak


def _daily_longest_streak(completed_dates: set[date], habit_start: date, today: date) -> int:
    longest = 0
    current = 0
    for day in _daterange(habit_start, today):
        if day in completed_dates:
            current += 1
            longest = max(longest, current)
        else:
            current = 0
    return longest


def _weekly_completed_weeks(completed_dates: set[date]) -> set[date]:
    return {_week_start(day) for day in completed_dates}


def _weekly_current_streak(completed_weeks: set[date], habit_start: date, today: date) -> int:
    current_week = _week_start(today)
    cursor = current_week if current_week in completed_weeks else current_week - timedelta(days=7)
    first_week = _week_start(habit_start)
    streak = 0
    while cursor >= first_week and cursor in completed_weeks:
        streak += 1
        cursor -= timedelta(days=7)
    return streak


def _weekly_longest_streak(completed_weeks: set[date], habit_start: date, today: date) -> int:
    cursor = _week_start(habit_start)
    last_week = _week_start(today)
    longest = 0
    current = 0
    while cursor <= last_week:
        if cursor in completed_weeks:
            current += 1
            longest = max(longest, current)
        else:
            current = 0
        cursor += timedelta(days=7)
    return longest


def _completion_rate(completed_dates: set[date], habit: Habit, today: date) -> float:
    start = max(habit.created_at.date(), today - timedelta(days=29))
    if start > today:
        return 0.0

    if habit.frequency == HabitFrequency.daily:
        target_dates = set(_daterange(start, today))
        completed = len(completed_dates & target_dates)
        total = len(target_dates)
    else:
        target_weeks = set()
        cursor = _week_start(start)
        while cursor <= _week_start(today):
            target_weeks.add(cursor)
            cursor += timedelta(days=7)
        completed = len(_weekly_completed_weeks(completed_dates) & target_weeks)
        total = len(target_weeks)

    return round((completed / total) * 100, 1) if total else 0.0


async def get_habit_stats(db: AsyncSession, redis: Redis, user_id: uuid.UUID, habit_id: uuid.UUID) -> dict:
    habit = await get_habit_for_user(db, user_id, habit_id)
    cache_key = f"habit:{habit.id}:stats"
    cached = await redis.get(cache_key)
    if cached:
        return dict(json.loads(cached))

    result = await db.execute(select(CheckIn.date).where(CheckIn.habit_id == habit.id).order_by(CheckIn.date.asc()))
    completed_dates = set(result.scalars().all())
    today = datetime.now(timezone.utc).date()
    habit_start = habit.created_at.date()

    if habit.frequency == HabitFrequency.daily:
        current_streak = _daily_current_streak(completed_dates, habit_start, today)
        longest_streak = _daily_longest_streak(completed_dates, habit_start, today)
    else:
        completed_weeks = _weekly_completed_weeks(completed_dates)
        current_streak = _weekly_current_streak(completed_weeks, habit_start, today)
        longest_streak = _weekly_longest_streak(completed_weeks, habit_start, today)

    payload = {
        "habit_id": str(habit.id),
        "current_streak": current_streak,
        "longest_streak": longest_streak,
        "completion_rate_30d": _completion_rate(completed_dates, habit, today),
    }
    await redis.set(cache_key, json.dumps(payload), ex=CACHE_TTL_SECONDS)
    return payload


async def get_weekly_summary(db: AsyncSession, redis: Redis, user_id: uuid.UUID) -> dict:
    today = datetime.now(timezone.utc).date()
    week_start = _week_start(today)
    week_end = week_start + timedelta(days=6)
    cache_key = f"weekly_summary:{user_id}:{week_start.isoformat()}"
    cached = await redis.get(cache_key)
    if cached:
        return dict(json.loads(cached))

    habits = await list_habits(db, user_id)
    habit_ids = [habit.id for habit in habits]
    completed_by_habit: dict[uuid.UUID, set[date]] = defaultdict(set)

    if habit_ids:
        result = await db.execute(
            select(CheckIn.habit_id, CheckIn.date)
            .join(Habit, Habit.id == CheckIn.habit_id)
            .where(
                Habit.user_id == user_id,
                CheckIn.date >= week_start,
                CheckIn.date <= week_end,
            )
        )
        for habit_id_value, completed_date in result.all():
            completed_by_habit[habit_id_value].add(completed_date)

    payload = {
        "week": f"{week_start.isoformat()}/{week_end.isoformat()}",
        "habits": [
            {
                "habit_id": str(habit.id),
                "name": habit.name,
                "days_completed_this_week": min(
                    len(completed_by_habit[habit.id]),
                    7 if habit.frequency == HabitFrequency.daily else 1,
                ),
                "target_days": 7 if habit.frequency == HabitFrequency.daily else 1,
            }
            for habit in habits
        ],
    }
    await redis.set(cache_key, json.dumps(payload), ex=CACHE_TTL_SECONDS)
    return payload
