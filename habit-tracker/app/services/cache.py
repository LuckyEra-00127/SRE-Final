from __future__ import annotations

import uuid

from redis.asyncio import Redis


async def delete_by_pattern(redis: Redis, pattern: str) -> None:
    keys: list[str] = []
    async for key in redis.scan_iter(match=pattern, count=100):
        keys.append(str(key))
    if keys:
        await redis.delete(*keys)


async def invalidate_habit_cache(redis: Redis, user_id: uuid.UUID, habit_id: uuid.UUID) -> None:
    await redis.delete(f"habit:{habit_id}:stats")
    await delete_by_pattern(redis, f"weekly_summary:{user_id}:*")
