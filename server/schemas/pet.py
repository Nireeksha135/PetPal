from datetime import datetime, date
from pydantic import BaseModel, ConfigDict, Field, field_validator

from server.models.pet import PetSpecies, PetGender


class PetBase(BaseModel):
    name: str = Field(min_length=1, max_length=80)
    species: PetSpecies
    breed: str | None = Field(default=None, max_length=120)
    gender: PetGender = PetGender.UNKNOWN
    date_of_birth: date | None = None
    weight_kg: float | None = Field(default=None, ge=0, le=500)
    color: str | None = Field(default=None, max_length=80)
    microchip_id: str | None = Field(default=None, max_length=80)
    is_neutered: bool = False
    notes: str | None = Field(default=None, max_length=2000)

    @field_validator("date_of_birth")
    @classmethod
    def dob_not_in_future(cls, value: date | None) -> date | None:
        if value and value > date.today():
            raise ValueError("Date of birth cannot be in the future.")
        return value

    @field_validator("name")
    @classmethod
    def name_not_blank(cls, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError("Name cannot be blank.")
        return stripped


class PetCreate(PetBase):
    pass


class PetUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=80)
    species: PetSpecies | None = None
    breed: str | None = Field(default=None, max_length=120)
    gender: PetGender | None = None
    date_of_birth: date | None = None
    weight_kg: float | None = Field(default=None, ge=0, le=500)
    color: str | None = Field(default=None, max_length=80)
    microchip_id: str | None = Field(default=None, max_length=80)
    is_neutered: bool | None = None
    notes: str | None = Field(default=None, max_length=2000)
    avatar_url: str | None = None


class PetRead(PetBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    owner_id: str
    avatar_url: str | None = None
    created_at: datetime
    updated_at: datetime


class PetListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    species: PetSpecies
    breed: str | None = None
    date_of_birth: date | None = None
    avatar_url: str | None = None
