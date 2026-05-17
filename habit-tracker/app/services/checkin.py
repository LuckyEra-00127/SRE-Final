from __future__ import annotations

import uuid
from datetime import datetime, timezone

from redis.asyncio import Redis
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.metrics import habit_checkins_total
from app.models.checkin import CheckIn
from app.services.cache import invalidate_habit_cache
from app.services.habits import get_habit_for_user


async def check_in_today(db: AsyncSession, redis: Redis, user_id: uuid.UUID, habit_id: uuid.UUID) -> CheckIn:
    habit = await get_habit_for_user(db, user_id, habit_id)
    today = datetime.now(timezone.utc).date()

    result = await db.execute(select(CheckIn).where(CheckIn.habit_id == habit.id, CheckIn.date == today))
    existing = result.scalar_one_or_none()
    if existing is not None:
        return existing

    checkin = CheckIn(habit_id=habit.id, date=today)
    db.add(checkin)
    await db.commit()
    await db.refresh(checkin)
    habit_checkins_total.labels(frequency=habit.frequency.value).inc()
    await invalidate_habit_cache(redis, user_id, habit.id)
    return checkin
