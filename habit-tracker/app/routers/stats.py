from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, Query
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_current_user, get_db, get_redis
from app.models.user import User
from app.services.calendar import get_month_calendar, get_user_month_activity_calendar
from app.schemas.stats import CalendarResponse, HabitStatsResponse, MonthlyActivityCalendarResponse, WeeklySummaryResponse
from app.services.stats import get_habit_stats, get_weekly_summary

router = APIRouter(prefix="/habits", tags=["stats"])


@router.get("/summary/weekly", response_model=WeeklySummaryResponse)
async def weekly_summary(
    db: AsyncSession = Depends(get_db),
    redis: Redis = Depends(get_redis),
    current_user: User = Depends(get_current_user),
) -> WeeklySummaryResponse:
    return await get_weekly_summary(db, redis, current_user.id)


@router.get("/calendar/monthly", response_model=MonthlyActivityCalendarResponse)
async def monthly_activity_calendar(
    year: int = Query(ge=2000, le=2100),
    month: int = Query(ge=1, le=12),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> MonthlyActivityCalendarResponse:
    return await get_user_month_activity_calendar(db, current_user.id, year, month)


@router.get("/{habit_id}/stats", response_model=HabitStatsResponse)
async def habit_stats(
    habit_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    redis: Redis = Depends(get_redis),
    current_user: User = Depends(get_current_user),
) -> HabitStatsResponse:
    return await get_habit_stats(db, redis, current_user.id, habit_id)


@router.get("/{habit_id}/calendar", response_model=CalendarResponse)
async def habit_calendar(
    habit_id: uuid.UUID,
    year: int = Query(ge=2000, le=2100),
    month: int = Query(ge=1, le=12),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> CalendarResponse:
    return await get_month_calendar(db, current_user.id, habit_id, year, month)
