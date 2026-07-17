import uuid
from datetime import datetime, date, timezone
import enum

from sqlalchemy import String, DateTime, Date, ForeignKey, Enum as SAEnum, Boolean, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from server.database.base import Base


def _uuid() -> str:
    return str(uuid.uuid4())


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class MedicineFrequency(str, enum.Enum):
    ONCE_DAILY = "once_daily"
    TWICE_DAILY = "twice_daily"
    THREE_TIMES_DAILY = "three_times_daily"
    WEEKLY = "weekly"
    AS_NEEDED = "as_needed"
    CUSTOM = "custom"


class Medicine(Base):
    __tablename__ = "medicines"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    pet_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("pets.id", ondelete="CASCADE"), nullable=False, index=True
    )
    owner_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )

    name: Mapped[str] = mapped_column(String(120), nullable=False)
    dosage: Mapped[str] = mapped_column(String(80), nullable=False)
    frequency: Mapped[MedicineFrequency] = mapped_column(
        SAEnum(MedicineFrequency, name="medicine_frequency"), nullable=False
    )
    times_per_day: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    instructions: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    prescribed_by: Mapped[str | None] = mapped_column(String(120), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=_utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=_utcnow, onupdate=_utcnow, nullable=False
    )

    pet = relationship("Pet", backref="medicines")
    logs = relationship(
        "MedicineLog", backref="medicine", cascade="all, delete-orphan"
    )


class MedicineLog(Base):
    __tablename__ = "medicine_logs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    medicine_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("medicines.id", ondelete="CASCADE"), nullable=False, index=True
    )
    scheduled_for: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    given_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="pending", nullable=False)
    notes: Mapped[str | None] = mapped_column(String(500), nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=_utcnow, nullable=False
    )
