from datetime import datetime, date
from pydantic import BaseModel, ConfigDict, Field, field_validator


class VaccinationBase(BaseModel):
    vaccine_name: str = Field(min_length=1, max_length=120)
    date_administered: date 
    next_due_date: date | None = None
    administered_by: str | None = Field(default=None, max_length=120)
    clinic_name: str | None = Field(default=None, max_length=120)
    batch_number: str | None = Field(default=None, max_length=80)
    notes: str | None = Field(default=None, max_length=1000)
    reminder_enabled: bool = True

    @field_validator("date_administered")
    @classmethod
    def not_in_future(cls, value: date) -> date:
        if value > date.today():
            raise ValueError("Date administered cannot be in the future.")
        return value

    @field_validator("next_due_date")
    @classmethod
    def due_after_administered(cls, value: date | None, info):
        administered = info.data.get("date_administered")
        if value and administered and value < administered:
            raise ValueError("Next due date cannot be before the date administered.")
        return value

    @field_validator("vaccine_name")
    @classmethod
    def name_not_blank(cls, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError("Vaccine name cannot be blank.")
        return stripped


class VaccinationCreate(VaccinationBase):
    pet_id: str


class VaccinationUpdate(BaseModel):
    vaccine_name: str | None = Field(default=None, min_length=1, max_length=120)
    date_administered: date | None = None
    next_due_date: date | None = None
    administered_by: str | None = Field(default=None, max_length=120)
    clinic_name: str | None = Field(default=None, max_length=120)
    batch_number: str | None = Field(default=None, max_length=80)
    notes: str | None = Field(default=None, max_length=1000)
    reminder_enabled: bool | None = None


class VaccinationRead(VaccinationBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    pet_id: str
    owner_id: str
    created_at: datetime
    updated_at: datetime
