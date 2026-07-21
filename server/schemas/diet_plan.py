from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

from server.models.diet_plan import ActivityLevel, BodyCondition


class DietPlanRequest(BaseModel):
    pet_id: str
    activity_level: ActivityLevel = ActivityLevel.MODERATE
    body_condition: BodyCondition = BodyCondition.UNKNOWN
    current_weight_kg: float | None = Field(default=None, ge=0, le=500)
    goal_weight_kg: float | None = Field(default=None, ge=0, le=500)
    allergies: str | None = Field(default=None, max_length=500)
    health_conditions: str | None = Field(default=None, max_length=500)
    additional_notes: str | None = Field(default=None, max_length=1000)


class DietPlanRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    pet_id: str
    owner_id: str
    activity_level: ActivityLevel
    body_condition: BodyCondition
    current_weight_kg: float | None = None
    goal_weight_kg: float | None = None
    allergies: str | None = None
    health_conditions: str | None = None
    additional_notes: str | None = None
    ai_recommendation: str
    created_at: datetime
