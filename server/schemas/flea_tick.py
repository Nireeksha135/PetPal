from datetime import datetime, date
from pydantic import BaseModel, ConfigDict, Field, field_validator
from typing import Literal


TreatmentType = Literal["topical", "oral", "collar", "shampoo", "spray", "other"]


class FleaTickBase(BaseModel):
    product_name: str = Field(min_length=1, max_length=120)
    treatment_type: TreatmentType = "topical"
    date_applied: date
    next_due_date: date | None = None
    administered_by: str | None = Field(default=None, max_length=120)
    notes: str | None = Field(default=None, max_length=1000)
    reminder_enabled: bool = True

    @field_validator("date_applied")
    @classmethod
    def not_in_future(cls, value: date) -> date:
        if value > date.today():
            raise ValueError("Date applied cannot be in the future.")
        return value

    @field_validator("next_due_date")
    @classmethod
    def due_after_applied(cls, value: date | None, info):
        applied = info.data.get("date_applied")
        if value and applied and value < applied:
            raise ValueError("Next due date cannot be before the date applied.")
        return value

    @field_validator("product_name")
    @classmethod
    def name_not_blank(cls, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError("Product name cannot be blank.")
        return stripped


class FleaTickCreate(FleaTickBase):
    pet_id: str


class FleaTickUpdate(BaseModel):
    product_name: str | None = Field(default=None, min_length=1, max_length=120)
    treatment_type: TreatmentType | None = None
    date_applied: date | None = None
    next_due_date: date | None = None
    administered_by: str | None = Field(default=None, max_length=120)
    notes: str | None = Field(default=None, max_length=1000)
    reminder_enabled: bool | None = None


class FleaTickRead(FleaTickBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    pet_id: str
    owner_id: str
    created_at: datetime
    updated_at: datetime
