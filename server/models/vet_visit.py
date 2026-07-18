import uuid
from datetime import datetime, date, timezone
import enum

from sqlalchemy import String, DateTime, Date, ForeignKey, Enum as SAEnum, Float, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

from server.database.base import Base


def _uuid() -> str:
    return str(uuid.uuid4())


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class VisitType(str, enum.Enum):
    CHECKUP = "checkup"
    SICK_VISIT = "sick_visit"
    SURGERY = "surgery"
    EMERGENCY = "emergency"
    DENTAL = "dental"
    GROOMING = "grooming"
    FOLLOW_UP = "follow_up"
    OTHER = "other"


class VetVisit(Base):
    __tablename__ = "vet_visits"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    pet_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("pets.id", ondelete="CASCADE"), nullable=False, index=True
    )
    owner_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )

    visit_date: Mapped[date] = mapped_column(Date, nullable=False)
    visit_type: Mapped[VisitType] = mapped_column(
        SAEnum(VisitType, name="visit_type"), default=VisitType.CHECKUP, nullable=False
    )
    reason: Mapped[str] = mapped_column(String(200), nullable=False)
    vet_name: Mapped[str | None] = mapped_column(String(120), nullable=True)
    clinic_name: Mapped[str | None] = mapped_column(String(120), nullable=True)
    diagnosis: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    treatment: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    cost: Mapped[float | None] = mapped_column(Float, nullable=True)
    follow_up_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    follow_up_needed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    notes: Mapped[str | None] = mapped_column(String(1000), nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=_utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=_utcnow, onupdate=_utcnow, nullable=False
    )

    pet = relationship("Pet", backref="vet_visits")
