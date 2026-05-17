from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, Response, status
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_current_user, get_db, get_redis
from app.models.user import User
from app.schemas.habit import CheckInResponse, HabitCreate, HabitResponse, HabitUpdate
from app.services import checkin as checkin_service
from app.services import habits as habit_service
from app.services.cache import invalidate_habit_cache

router = APIRouter(prefix="/habits", tags=["habits"])


@router.get("", response_model=list[HabitResponse])
async def get_habits(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[HabitResponse]:
    return await habit_service.list_habits(db, current_user.id)


@router.post("", response_model=HabitResponse, status_code=status.HTTP_201_CREATED)
async def create_habit(
    payload: HabitCreate,
    db: AsyncSession = Depends(get_db),
    redis: Redis = Depends(get_redis),
    current_user: User = Depends(get_current_user),
) -> HabitResponse:
    habit = await habit_service.create_habit(db, current_user.id, payload)
    await invalidate_habit_cache(redis, current_user.id, habit.id)
    return habit


@router.put("/{habit_id}", response_model=HabitResponse)
async def update_habit(
    habit_id: uuid.UUID,
    payload: HabitUpdate,
    db: AsyncSession = Depends(get_db),
    redis: Redis = Depends(get_redis),
    current_user: User = Depends(get_current_user),
) -> HabitResponse:
    habit = await habit_service.update_habit(db, current_user.id, habit_id, payload)
    await invalidate_habit_cache(redis, current_user.id, habit_id)
    return habit


@router.delete("/{habit_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_habit(
    habit_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    redis: Redis = Depends(get_redis),
    current_user: User = Depends(get_current_user),
) -> Response:
    await habit_service.delete_habit(db, current_user.id, habit_id)
    await invalidate_habit_cache(redis, current_user.id, habit_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/{habit_id}/checkin", response_model=CheckInResponse)
async def check_in(
    habit_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    redis: Redis = Depends(get_redis),
    current_user: User = Depends(get_current_user),
) -> CheckInResponse:
    return await checkin_service.check_in_today(db, redis, current_user.id, habit_id)
