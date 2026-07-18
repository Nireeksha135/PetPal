from datetime import datetime, date
from pydantic import BaseModel, ConfigDict, Field, field_validator

from server.models.vet_visit import VisitType


class VetVisitBase(BaseModel):
    visit_date: date
    visit_type: VisitType = VisitType.CHECKUP
    reason: str = Field(min_length=1, max_length=200)
    vet_name: str | None = Field(default=None, max_length=120)
    clinic_name: str | None = Field(default=None, max_length=120)
    diagnosis: str | None = Field(default=None, max_length=1000)
    treatment: str | None = Field(default=None, max_length=1000)
    cost: float | None = Field(default=None, ge=0, le=1_000_000)
    follow_up_date: date | None = None
    follow_up_needed: bool = False
    notes: str | None = Field(default=None, max_length=1000)

    @field_validator("visit_date")
    @classmethod
    def not_too_far_future(cls, value: date) -> date:
        # allow future dates for scheduled/upcoming visits, but not absurdly far
        from datetime import timedelta
        if value > date.today() + timedelta(days=365 * 2):
            raise ValueError("Visit date is too far in the future.")
        return value

    @field_validator("follow_up_date")
    @classmethod
    def follow_up_after_visit(cls, value: date | None, info):
        visit_date = info.data.get("visit_date")
        if value and visit_date and value < visit_date:
            raise ValueError("Follow-up date cannot be before the visit date.")
        return value

    @field_validator("reason")
    @classmethod
    def reason_not_blank(cls, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError("Reason cannot be blank.")
        return stripped


class VetVisitCreate(VetVisitBase):
    pet_id: str


class VetVisitUpdate(BaseModel):
    visit_date: date | None = None
    visit_type: VisitType | None = None
    reason: str | None = Field(default=None, min_length=1, max_length=200)
    vet_name: str | None = Field(default=None, max_length=120)
    clinic_name: str | None = Field(default=None, max_length=120)
    diagnosis: str | None = Field(default=None, max_length=1000)
    treatment: str | None = Field(default=None, max_length=1000)
    cost: float | None = Field(default=None, ge=0, le=1_000_000)
    follow_up_date: date | None = None
    follow_up_needed: bool | None = None
    notes: str | None = Field(default=None, max_length=1000)


class VetVisitRead(VetVisitBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    pet_id: str
    owner_id: str
    created_at: datetime
    updated_at: datetime
