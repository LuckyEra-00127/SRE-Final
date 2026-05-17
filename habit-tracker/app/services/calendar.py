from __future__ import annotations

import calendar
import uuid
from datetime import date, datetime, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.checkin import CheckIn
from app.models.habit import Habit
from app.services.habits import get_habit_for_user


async def get_month_calendar(
    db: AsyncSession,
    user_id: uuid.UUID,
    habit_id: uuid.UUID,
    year: int,
    month: int,
) -> dict:
    habit = await get_habit_for_user(db, user_id, habit_id)
    _, last_day = calendar.monthrange(year, month)
    first_date = date(year, month, 1)
    last_date = date(year, month, last_day)

    result = await db.execute(
        select(CheckIn.date).where(
            CheckIn.habit_id == habit.id,
            CheckIn.date >= first_date,
            CheckIn.date <= last_date,
        )
    )
    completed_dates = set(result.scalars().all())
    today = datetime.now(timezone.utc).date()
    habit_start = habit.created_at.date()

    days: dict[str, str] = {}
    tracked_past_days = 0
    completed_tracked_days = 0

    for day_number in range(1, last_day + 1):
        current = date(year, month, day_number)
        if current < habit_start:
            status = "future"
        elif current in completed_dates:
            status = "done"
            tracked_past_days += 1
            completed_tracked_days += 1
        elif current >= today:
            status = "future"
        else:
            status = "missed"
            tracked_past_days += 1
        days[current.isoformat()] = status

    completion_rate = round((completed_tracked_days / tracked_past_days) * 100, 1) if tracked_past_days else 0.0
    return {
        "habit_id": str(habit.id),
        "month": f"{year:04d}-{month:02d}",
        "days": days,
        "completion_rate": completion_rate,
    }


async def get_user_month_activity_calendar(
    db: AsyncSession,
    user_id: uuid.UUID,
    year: int,
    month: int,
) -> dict:
    _, last_day = calendar.monthrange(year, month)
    first_date = date(year, month, 1)
    last_date = date(year, month, last_day)

    result = await db.execute(
        select(CheckIn.date, Habit.id, Habit.name)
        .join(Habit, Habit.id == CheckIn.habit_id)
        .where(
            Habit.user_id == user_id,
            CheckIn.date >= first_date,
            CheckIn.date <= last_date,
        )
        .order_by(CheckIn.date.asc(), Habit.name.asc())
    )

    days: dict[str, list[dict[str, str]]] = {
        date(year, month, day_number).isoformat(): [] for day_number in range(1, last_day + 1)
    }
    for completed_date, habit_id, habit_name in result.all():
        days[completed_date.isoformat()].append(
            {
                "habit_id": str(habit_id),
                "name": habit_name,
            }
        )

    return {
        "month": f"{year:04d}-{month:02d}",
        "days": days,
    }
