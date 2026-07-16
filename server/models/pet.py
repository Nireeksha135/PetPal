import uuid
from datetime import datetime, date, timezone

from sqlalchemy import String, DateTime, Date, ForeignKey, Enum as SAEnum, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum

from server.database.base import Base


def _uuid() -> str:
    return str(uuid.uuid4())


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class PetSpecies(str, enum.Enum):
    DOG = "dog"
    CAT = "cat"
    BIRD = "bird"
    RABBIT = "rabbit"
    FISH = "fish"
    REPTILE = "reptile"
    RODENT = "rodent"
    OTHER = "other"


class PetGender(str, enum.Enum):
    MALE = "male"
    FEMALE = "female"
    UNKNOWN = "unknown"


class Pet(Base):
    __tablename__ = "pets"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    owner_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )

    name: Mapped[str] = mapped_column(String(80), nullable=False)
    species: Mapped[PetSpecies] = mapped_column(
        SAEnum(PetSpecies, name="pet_species"), nullable=False
    )
    breed: Mapped[str | None] = mapped_column(String(120), nullable=True)
    gender: Mapped[PetGender] = mapped_column(
        SAEnum(PetGender, name="pet_gender"), default=PetGender.UNKNOWN, nullable=False
    )
    date_of_birth: Mapped[date | None] = mapped_column(Date, nullable=True)
    weight_kg: Mapped[float | None] = mapped_column(Float, nullable=True)
    color: Mapped[str | None] = mapped_column(String(80), nullable=True)
    microchip_id: Mapped[str | None] = mapped_column(String(80), nullable=True)
    is_neutered: Mapped[bool] = mapped_column(default=False, nullable=False)
    notes: Mapped[str | None] = mapped_column(String(2000), nullable=True)
    avatar_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=_utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=_utcnow, onupdate=_utcnow, nullable=False
    )

    owner = relationship("User", backref="pets")
