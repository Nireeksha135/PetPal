from datetime import date, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import select

from server.models.vaccination import Vaccination
from server.schemas.vaccination import VaccinationCreate, VaccinationUpdate
from server.services.pet_service import get_pet, PetError


class VaccinationError(Exception):
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(message)


def list_vaccinations_for_pet(db: Session, owner_id: str, pet_id: str) -> list[Vaccination]:
    try:
        get_pet(db, owner_id, pet_id)
    except PetError as e:
        raise VaccinationError(e.message, e.status_code)

    stmt = (
        select(Vaccination)
        .where(Vaccination.pet_id == pet_id, Vaccination.owner_id == owner_id)
        .order_by(Vaccination.date_administered.desc())
    )
    return list(db.execute(stmt).scalars().all())


def list_vaccinations_for_owner(db: Session, owner_id: str) -> list[Vaccination]:
    stmt = (
        select(Vaccination)
        .where(Vaccination.owner_id == owner_id)
        .order_by(Vaccination.date_administered.desc())
    )
    return list(db.execute(stmt).scalars().all())


def get_vaccination(db: Session, owner_id: str, vaccination_id: str) -> Vaccination:
    vaccination = db.get(Vaccination, vaccination_id)
    if vaccination is None or vaccination.owner_id != owner_id:
        raise VaccinationError("Vaccination record not found.", 404)
    return vaccination


def create_vaccination(db: Session, owner_id: str, payload: VaccinationCreate) -> Vaccination:
    try:
        get_pet(db, owner_id, payload.pet_id)
    except PetError as e:
        raise VaccinationError(e.message, e.status_code)

    data = payload.model_dump(exclude={"pet_id"})
    vaccination = Vaccination(owner_id=owner_id, pet_id=payload.pet_id, **data)
    db.add(vaccination)
    db.commit()
    db.refresh(vaccination)
    return vaccination


def update_vaccination(
    db: Session, owner_id: str, vaccination_id: str, payload: VaccinationUpdate
) -> Vaccination:
    vaccination = get_vaccination(db, owner_id, vaccination_id)
    updates = payload.model_dump(exclude_unset=True)
    for field, value in updates.items():
        setattr(vaccination, field, value)
    db.commit()
    db.refresh(vaccination)
    return vaccination


def delete_vaccination(db: Session, owner_id: str, vaccination_id: str) -> None:
    vaccination = get_vaccination(db, owner_id, vaccination_id)
    db.delete(vaccination)
    db.commit()


def count_upcoming_and_overdue(db: Session, owner_id: str, window_days: int = 30) -> tuple[int, int]:
    today = date.today()
    horizon = today + timedelta(days=window_days)

    stmt = select(Vaccination).where(
        Vaccination.owner_id == owner_id,
        Vaccination.reminder_enabled.is_(True),
        Vaccination.next_due_date.is_not(None),
    )
    vaccinations = db.execute(stmt).scalars().all()

    upcoming = sum(
        1 for v in vaccinations if v.next_due_date and today <= v.next_due_date <= horizon
    )
    overdue = sum(1 for v in vaccinations if v.next_due_date and v.next_due_date < today)
    return upcoming, overdue
