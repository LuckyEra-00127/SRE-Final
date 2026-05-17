from __future__ import annotations

import uuid
from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models.habit import HabitFrequency


class HabitCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    description: str | None = Field(default=None, max_length=2000)
    frequency: HabitFrequency

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError("Habit name cannot be blank")
        return stripped

    @field_validator("description")
    @classmethod
    def validate_description(cls, value: str | None) -> str | None:
        if value is None:
            return None
        stripped = value.strip()
        return stripped or None


class HabitUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=120)
    description: str | None = Field(default=None, max_length=2000)
    frequency: HabitFrequency | None = None

    @field_validator("name")
    @classmethod
    def validate_optional_name(cls, value: str | None) -> str | None:
        if value is None:
            return None
        stripped = value.strip()
        if not stripped:
            raise ValueError("Habit name cannot be blank")
        return stripped

    @field_validator("description")
    @classmethod
    def validate_optional_description(cls, value: str | None) -> str | None:
        if value is None:
            return None
        stripped = value.strip()
        return stripped or None


class HabitResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    name: str
    description: str | None
    frequency: HabitFrequency
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CheckInResponse(BaseModel):
    id: uuid.UUID
    habit_id: uuid.UUID
    date: date
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
