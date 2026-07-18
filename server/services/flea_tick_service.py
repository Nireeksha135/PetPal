from datetime import date, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import select

from server.models.flea_tick import FleaTickTreatment
from server.schemas.flea_tick import FleaTickCreate, FleaTickUpdate
from server.services.pet_service import get_pet, PetError


class FleaTickError(Exception):
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(message)


def list_treatments_for_pet(db: Session, owner_id: str, pet_id: str) -> list[FleaTickTreatment]:
    try:
        get_pet(db, owner_id, pet_id)
    except PetError as e:
        raise FleaTickError(e.message, e.status_code)

    stmt = (
        select(FleaTickTreatment)
        .where(FleaTickTreatment.pet_id == pet_id, FleaTickTreatment.owner_id == owner_id)
        .order_by(FleaTickTreatment.date_applied.desc())
    )
    return list(db.execute(stmt).scalars().all())


def list_treatments_for_owner(db: Session, owner_id: str) -> list[FleaTickTreatment]:
    stmt = (
        select(FleaTickTreatment)
        .where(FleaTickTreatment.owner_id == owner_id)
        .order_by(FleaTickTreatment.date_applied.desc())
    )
    return list(db.execute(stmt).scalars().all())


def get_treatment(db: Session, owner_id: str, treatment_id: str) -> FleaTickTreatment:
    treatment = db.get(FleaTickTreatment, treatment_id)
    if treatment is None or treatment.owner_id != owner_id:
        raise FleaTickError("Flea & tick treatment not found.", 404)
    return treatment


def create_treatment(db: Session, owner_id: str, payload: FleaTickCreate) -> FleaTickTreatment:
    try:
        get_pet(db, owner_id, payload.pet_id)
    except PetError as e:
        raise FleaTickError(e.message, e.status_code)

    data = payload.model_dump(exclude={"pet_id"})
    treatment = FleaTickTreatment(owner_id=owner_id, pet_id=payload.pet_id, **data)
    db.add(treatment)
    db.commit()
    db.refresh(treatment)
    return treatment


def update_treatment(
    db: Session, owner_id: str, treatment_id: str, payload: FleaTickUpdate
) -> FleaTickTreatment:
    treatment = get_treatment(db, owner_id, treatment_id)
    updates = payload.model_dump(exclude_unset=True)
    for field, value in updates.items():
        setattr(treatment, field, value)
    db.commit()
    db.refresh(treatment)
    return treatment


def delete_treatment(db: Session, owner_id: str, treatment_id: str) -> None:
    treatment = get_treatment(db, owner_id, treatment_id)
    db.delete(treatment)
    db.commit()


def count_upcoming_and_overdue(db: Session, owner_id: str, window_days: int = 30) -> tuple[int, int]:
    today = date.today()
    horizon = today + timedelta(days=window_days)

    stmt = select(FleaTickTreatment).where(
        FleaTickTreatment.owner_id == owner_id,
        FleaTickTreatment.reminder_enabled.is_(True),
        FleaTickTreatment.next_due_date.is_not(None),
    )
    treatments = db.execute(stmt).scalars().all()

    upcoming = sum(
        1 for t in treatments if t.next_due_date and today <= t.next_due_date <= horizon
    )
    overdue = sum(1 for t in treatments if t.next_due_date and t.next_due_date < today)
    return upcoming, overdue
