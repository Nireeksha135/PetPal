import uuid
from datetime import datetime, date, timezone

from sqlalchemy import String, DateTime, Date, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

from server.database.base import Base


def _uuid() -> str:
    return str(uuid.uuid4())


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class FleaTickTreatment(Base):
    __tablename__ = "flea_tick_treatments"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    pet_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("pets.id", ondelete="CASCADE"), nullable=False, index=True
    )
    owner_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )

    product_name: Mapped[str] = mapped_column(String(120), nullable=False)
    treatment_type: Mapped[str] = mapped_column(String(30), default="topical", nullable=False)
    date_applied: Mapped[date] = mapped_column(Date, nullable=False)
    next_due_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    administered_by: Mapped[str | None] = mapped_column(String(120), nullable=True)
    notes: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    reminder_enabled: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=_utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=_utcnow, onupdate=_utcnow, nullable=False
    )

    pet = relationship("Pet", backref="flea_tick_treatments")
