import uuid
from datetime import datetime, timezone
import enum

from sqlalchemy import String, DateTime, ForeignKey, Text, Enum as SAEnum, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship

from server.database.base import Base


def _uuid() -> str:
    return str(uuid.uuid4())


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class ActivityLevel(str, enum.Enum):
    LOW = "low"
    MODERATE = "moderate"
    HIGH = "high"


class BodyCondition(str, enum.Enum):
    UNDERWEIGHT = "underweight"
    IDEAL = "ideal"
    OVERWEIGHT = "overweight"
    UNKNOWN = "unknown"


class DietPlan(Base):
    __tablename__ = "diet_plans"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    pet_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("pets.id", ondelete="CASCADE"), nullable=False, index=True
    )
    owner_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )

    activity_level: Mapped[ActivityLevel] = mapped_column(
        SAEnum(ActivityLevel, name="activity_level"), default=ActivityLevel.MODERATE, nullable=False
    )
    body_condition: Mapped[BodyCondition] = mapped_column(
        SAEnum(BodyCondition, name="body_condition"), default=BodyCondition.UNKNOWN, nullable=False
    )
    current_weight_kg: Mapped[float | None] = mapped_column(Float, nullable=True)
    goal_weight_kg: Mapped[float | None] = mapped_column(Float, nullable=True)
    allergies: Mapped[str | None] = mapped_column(String(500), nullable=True)
    health_conditions: Mapped[str | None] = mapped_column(String(500), nullable=True)
    additional_notes: Mapped[str | None] = mapped_column(String(1000), nullable=True)

    ai_recommendation: Mapped[str] = mapped_column(Text, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=_utcnow, nullable=False
    )

    pet = relationship("Pet", backref="diet_plans")
