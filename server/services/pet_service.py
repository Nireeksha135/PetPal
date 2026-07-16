from sqlalchemy.orm import Session
from sqlalchemy import select

from server.models.pet import Pet
from server.schemas.pet import PetCreate, PetUpdate


class PetError(Exception):
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(message)


def list_pets(db: Session, owner_id: str) -> list[Pet]:
    stmt = select(Pet).where(Pet.owner_id == owner_id).order_by(Pet.created_at.desc())
    return list(db.execute(stmt).scalars().all())


def get_pet(db: Session, owner_id: str, pet_id: str) -> Pet:
    pet = db.get(Pet, pet_id)
    if pet is None or pet.owner_id != owner_id:
        raise PetError("Pet not found.", 404)
    return pet


def create_pet(db: Session, owner_id: str, payload: PetCreate) -> Pet:
    pet = Pet(owner_id=owner_id, **payload.model_dump())
    db.add(pet)
    db.commit()
    db.refresh(pet)
    return pet


def update_pet(db: Session, owner_id: str, pet_id: str, payload: PetUpdate) -> Pet:
    pet = get_pet(db, owner_id, pet_id)
    updates = payload.model_dump(exclude_unset=True)
    for field, value in updates.items():
        setattr(pet, field, value)
    db.commit()
    db.refresh(pet)
    return pet


def delete_pet(db: Session, owner_id: str, pet_id: str) -> None:
    pet = get_pet(db, owner_id, pet_id)
    db.delete(pet)
    db.commit()


def count_pets(db: Session, owner_id: str) -> int:
    return db.query(Pet).filter(Pet.owner_id == owner_id).count()
