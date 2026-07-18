from datetime import date, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import select

from server.models.deworming import Deworming
from server.schemas.deworming import DewormingCreate, DewormingUpdate
from server.services.pet_service import get_pet, PetError


class DewormingError(Exception):
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(message)


def list_deworming_for_pet(db: Session, owner_id: str, pet_id: str) -> list[Deworming]:
    try:
        get_pet(db, owner_id, pet_id)
    except PetError as e:
        raise DewormingError(e.message, e.status_code)

    stmt = (
        select(Deworming)
        .where(Deworming.pet_id == pet_id, Deworming.owner_id == owner_id)
        .order_by(Deworming.date_given.desc())
    )
    return list(db.execute(stmt).scalars().all())


def list_deworming_for_owner(db: Session, owner_id: str) -> list[Deworming]:
    stmt = (
        select(Deworming)
        .where(Deworming.owner_id == owner_id)
        .order_by(Deworming.date_given.desc())
    )
    return list(db.execute(stmt).scalars().all())


def get_deworming(db: Session, owner_id: str, record_id: str) -> Deworming:
    record = db.get(Deworming, record_id)
    if record is None or record.owner_id != owner_id:
        raise DewormingError("Deworming record not found.", 404)
    return record


def create_deworming(db: Session, owner_id: str, payload: DewormingCreate) -> Deworming:
    try:
        get_pet(db, owner_id, payload.pet_id)
    except PetError as e:
        raise DewormingError(e.message, e.status_code)

    data = payload.model_dump(exclude={"pet_id"})
    record = Deworming(owner_id=owner_id, pet_id=payload.pet_id, **data)
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def update_deworming(
    db: Session, owner_id: str, record_id: str, payload: DewormingUpdate
) -> Deworming:
    record = get_deworming(db, owner_id, record_id)
    updates = payload.model_dump(exclude_unset=True)
    for field, value in updates.items():
        setattr(record, field, value)
    db.commit()
    db.refresh(record)
    return record


def delete_deworming(db: Session, owner_id: str, record_id: str) -> None:
    record = get_deworming(db, owner_id, record_id)
    db.delete(record)
    db.commit()


def count_upcoming_and_overdue(db: Session, owner_id: str, window_days: int = 30) -> tuple[int, int]:
    today = date.today()
    horizon = today + timedelta(days=window_days)

    stmt = select(Deworming).where(
        Deworming.owner_id == owner_id,
        Deworming.reminder_enabled.is_(True),
        Deworming.next_due_date.is_not(None),
    )
    records = db.execute(stmt).scalars().all()

    upcoming = sum(
        1 for r in records if r.next_due_date and today <= r.next_due_date <= horizon
    )
    overdue = sum(1 for r in records if r.next_due_date and r.next_due_date < today)
    return upcoming, overdue
