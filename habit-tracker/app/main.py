from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from redis import asyncio as aioredis
from sqlalchemy import text

from app import models
from app.database import AsyncSessionLocal, create_database_schema, engine, settings
from app.metrics import setup_metrics
from app.routers import auth, habits, stats
from app.services.habits import refresh_active_habits_gauge

models.User


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.redis = aioredis.from_url(settings.redis_url, encoding="utf-8", decode_responses=True)
    if settings.auto_create_tables:
        await create_database_schema()
    async with AsyncSessionLocal() as session:
        await refresh_active_habits_gauge(session)
    try:
        yield
    finally:
        await app.state.redis.close()
        await engine.dispose()


app = FastAPI(
    title="Habit Tracker API",
    version="1.0.0",
    lifespan=lifespan,
)

setup_metrics(app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(habits.router)
app.include_router(stats.router)


@app.get("/health", tags=["system"])
async def health() -> dict[str, str]:
    db_status = "ok"
    redis_status = "ok"

    try:
        async with AsyncSessionLocal() as session:
            await session.execute(text("SELECT 1"))
    except Exception:
        db_status = "error"

    try:
        await app.state.redis.ping()
    except Exception:
        redis_status = "error"

    return {"status": "ok" if db_status == "ok" and redis_status == "ok" else "error", "db": db_status, "redis": redis_status}
