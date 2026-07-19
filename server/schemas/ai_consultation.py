from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field, field_validator


class AIConsultationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    pet_id: str
    owner_id: str
    title: str
    symptoms: str
    image_url: str | None = None
    ai_response: str
    created_at: datetime


class AIConsultationSymptomsInput(BaseModel):
    pet_id: str
    symptoms: str = Field(min_length=10, max_length=2000)

    @field_validator("symptoms")
    @classmethod
    def not_blank(cls, value: str) -> str:
        stripped = value.strip()
        if len(stripped) < 10:
            raise ValueError("Please describe the symptoms in a bit more detail.")
        return stripped
