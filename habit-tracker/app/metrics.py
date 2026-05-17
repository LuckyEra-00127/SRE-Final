from __future__ import annotations

from prometheus_client import Counter, Gauge
from prometheus_fastapi_instrumentator import Instrumentator

habit_checkins_total = Counter(
    "habit_checkins_total",
    "Total number of successful habit check-ins.",
    ("frequency",),
)

active_habits_count = Gauge(
    "active_habits_count",
    "Current number of habits stored in the system.",
)


def setup_metrics(app) -> None:
    Instrumentator(
        should_group_status_codes=True,
        should_ignore_untemplated=True,
        excluded_handlers={"/metrics"},
    ).instrument(app).expose(app, endpoint="/metrics", include_in_schema=False)
