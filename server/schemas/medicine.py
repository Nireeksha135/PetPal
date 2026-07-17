from datetime import datetime, date
from pydantic import BaseModel, ConfigDict, Field, field_validator

from server.models.medicine import MedicineFrequency


class MedicineBase(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    dosage: str = Field(min_length=1, max_length=80)
    frequency: MedicineFrequency
    times_per_day: int = Field(default=1, ge=1, le=12)
    start_date: date
    end_date: date | None = None
    instructions: str | None = Field(default=None, max_length=1000)
    prescribed_by: str | None = Field(default=None, max_length=120)
    is_active: bool = True

    @field_validator("end_date")
    @classmethod
    def end_after_start(cls, value: date | None, info):
        start = info.data.get("start_date")
        if value and start and value < start:
            raise ValueError("End date cannot be before start date.")
        return value

    @field_validator("name", "dosage")
    @classmethod
    def not_blank(cls, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError("This field cannot be blank.")
        return stripped


class MedicineCreate(MedicineBase):
    pet_id: str


class MedicineUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=120)
    dosage: str | None = Field(default=None, min_length=1, max_length=80)
    frequency: MedicineFrequency | None = None
    times_per_day: int | None = Field(default=None, ge=1, le=12)
    start_date: date | None = None
    end_date: date | None = None
    instructions: str | None = Field(default=None, max_length=1000)
    prescribed_by: str | None = Field(default=None, max_length=120)
    is_active: bool | None = None


class MedicineRead(MedicineBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    pet_id: str
    owner_id: str
    created_at: datetime
    updated_at: datetime


class MedicineLogRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    medicine_id: str
    scheduled_for: datetime
    given_at: datetime | None = None
    status: str
    notes: str | None = None


class MedicineLogCreate(BaseModel):
    scheduled_for: datetime
    notes: str | None = Field(default=None, max_length=500)


class MedicineLogMarkGiven(BaseModel):
    given_at: datetime | None = None
    notes: str | None = Field(default=None, max_length=500)


class MedicineWithPet(MedicineRead):
    pet_name: str
