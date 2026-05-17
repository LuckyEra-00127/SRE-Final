from __future__ import annotations

import uuid

from fastapi import HTTPException, status
from sqlalchemy import delete, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.metrics import active_habits_count
from app.models.habit import Habit
from app.schemas.habit import HabitCreate, HabitUpdate


async def refresh_active_habits_gauge(db: AsyncSession) -> None:
    result = await db.execute(select(func.count(Habit.id)))
    active_habits_count.set(int(result.scalar_one()))


async def list_habits(db: AsyncSession, user_id: uuid.UUID) -> list[Habit]:
    result = await db.execute(select(Habit).where(Habit.user_id == user_id).order_by(Habit.created_at.desc()))
    return list(result.scalars().all())


async def get_habit_for_user(db: AsyncSession, user_id: uuid.UUID, habit_id: uuid.UUID) -> Habit:
    result = await db.execute(select(Habit).where(Habit.id == habit_id, Habit.user_id == user_id))
    habit = result.scalar_one_or_none()
    if habit is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Habit not found")
    return habit


async def create_habit(db: AsyncSession, user_id: uuid.UUID, payload: HabitCreate) -> Habit:
    habit = Habit(
        user_id=user_id,
        name=payload.name.strip(),
        description=payload.description.strip() if payload.description else None,
        frequency=payload.frequency,
    )
    db.add(habit)
    await db.commit()
    await db.refresh(habit)
    await refresh_active_habits_gauge(db)
    return habit


async def update_habit(db: AsyncSession, user_id: uuid.UUID, habit_id: uuid.UUID, payload: HabitUpdate) -> Habit:
    habit = await get_habit_for_user(db, user_id, habit_id)
    updates = payload.model_dump(exclude_unset=True)
    if "name" in updates and updates["name"] is not None:
        habit.name = updates["name"].strip()
    if "description" in updates:
        habit.description = updates["description"].strip() if updates["description"] else None
    if "frequency" in updates and updates["frequency"] is not None:
        habit.frequency = updates["frequency"]

    await db.commit()
    await db.refresh(habit)
    return habit


async def delete_habit(db: AsyncSession, user_id: uuid.UUID, habit_id: uuid.UUID) -> None:
    await get_habit_for_user(db, user_id, habit_id)
    await db.execute(delete(Habit).where(Habit.id == habit_id, Habit.user_id == user_id))
    await db.commit()
    await refresh_active_habits_gauge(db)
