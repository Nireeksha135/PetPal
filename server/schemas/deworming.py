from datetime import datetime, date
from pydantic import BaseModel, ConfigDict, Field, field_validator


class DewormingBase(BaseModel):
    product_name: str = Field(min_length=1, max_length=120)
    date_given: date
    next_due_date: date | None = None
    dosage: str | None = Field(default=None, max_length=80)
    administered_by: str | None = Field(default=None, max_length=120)
    notes: str | None = Field(default=None, max_length=1000)
    reminder_enabled: bool = True

    @field_validator("date_given")
    @classmethod
    def not_in_future(cls, value: date) -> date:
        if value > date.today():
            raise ValueError("Date given cannot be in the future.")
        return value

    @field_validator("next_due_date")
    @classmethod
    def due_after_given(cls, value: date | None, info):
        given = info.data.get("date_given")
        if value and given and value < given:
            raise ValueError("Next due date cannot be before the date given.")
        return value

    @field_validator("product_name")
    @classmethod
    def name_not_blank(cls, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError("Product name cannot be blank.")
        return stripped


class DewormingCreate(DewormingBase):
    pet_id: str


class DewormingUpdate(BaseModel):
    product_name: str | None = Field(default=None, min_length=1, max_length=120)
    date_given: date | None = None
    next_due_date: date | None = None
    dosage: str | None = Field(default=None, max_length=80)
    administered_by: str | None = Field(default=None, max_length=120)
    notes: str | None = Field(default=None, max_length=1000)
    reminder_enabled: bool | None = None


class DewormingRead(DewormingBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    pet_id: str
    owner_id: str
    created_at: datetime
    updated_at: datetime
