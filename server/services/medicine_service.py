from datetime import datetime, timezone
from sqlalchemy.orm import Session
from sqlalchemy import select

from server.models.medicine import Medicine, MedicineLog
from server.models.pet import Pet
from server.schemas.medicine import MedicineCreate, MedicineUpdate, MedicineLogCreate
from server.services.pet_service import get_pet, PetError


class MedicineError(Exception):
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(message)


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def list_medicines_for_pet(db: Session, owner_id: str, pet_id: str) -> list[Medicine]:
    try:
        get_pet(db, owner_id, pet_id)
    except PetError as e:
        raise MedicineError(e.message, e.status_code)

    stmt = (
        select(Medicine)
        .where(Medicine.pet_id == pet_id, Medicine.owner_id == owner_id)
        .order_by(Medicine.is_active.desc(), Medicine.created_at.desc())
    )
    return list(db.execute(stmt).scalars().all())


def list_medicines_for_owner(db: Session, owner_id: str) -> list[Medicine]:
    stmt = (
        select(Medicine)
        .where(Medicine.owner_id == owner_id)
        .order_by(Medicine.is_active.desc(), Medicine.created_at.desc())
    )
    return list(db.execute(stmt).scalars().all())


def get_medicine(db: Session, owner_id: str, medicine_id: str) -> Medicine:
    medicine = db.get(Medicine, medicine_id)
    if medicine is None or medicine.owner_id != owner_id:
        raise MedicineError("Medicine not found.", 404)
    return medicine


def create_medicine(db: Session, owner_id: str, payload: MedicineCreate) -> Medicine:
    try:
        get_pet(db, owner_id, payload.pet_id)
    except PetError as e:
        raise MedicineError(e.message, e.status_code)

    data = payload.model_dump(exclude={"pet_id"})
    medicine = Medicine(owner_id=owner_id, pet_id=payload.pet_id, **data)
    db.add(medicine)
    db.commit()
    db.refresh(medicine)
    return medicine


def update_medicine(
    db: Session, owner_id: str, medicine_id: str, payload: MedicineUpdate
) -> Medicine:
    medicine = get_medicine(db, owner_id, medicine_id)
    updates = payload.model_dump(exclude_unset=True)
    for field, value in updates.items():
        setattr(medicine, field, value)
    db.commit()
    db.refresh(medicine)
    return medicine


def delete_medicine(db: Session, owner_id: str, medicine_id: str) -> None:
    medicine = get_medicine(db, owner_id, medicine_id)
    db.delete(medicine)
    db.commit()


def list_logs_for_medicine(db: Session, owner_id: str, medicine_id: str) -> list[MedicineLog]:
    medicine = get_medicine(db, owner_id, medicine_id)
    stmt = (
        select(MedicineLog)
        .where(MedicineLog.medicine_id == medicine.id)
        .order_by(MedicineLog.scheduled_for.desc())
    )
    return list(db.execute(stmt).scalars().all())


def create_log(
    db: Session, owner_id: str, medicine_id: str, payload: MedicineLogCreate
) -> MedicineLog:
    medicine = get_medicine(db, owner_id, medicine_id)
    log = MedicineLog(
        medicine_id=medicine.id,
        scheduled_for=payload.scheduled_for,
        notes=payload.notes,
        status="pending",
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


def mark_log_given(
    db: Session, owner_id: str, medicine_id: str, log_id: str, given_at: datetime | None, notes: str | None
) -> MedicineLog:
    medicine = get_medicine(db, owner_id, medicine_id)
    log = db.get(MedicineLog, log_id)
    if log is None or log.medicine_id != medicine.id:
        raise MedicineError("Log entry not found.", 404)

    log.status = "given"
    log.given_at = given_at or _utcnow()
    if notes is not None:
        log.notes = notes
    db.commit()
    db.refresh(log)
    return log


def mark_log_missed(db: Session, owner_id: str, medicine_id: str, log_id: str) -> MedicineLog:
    medicine = get_medicine(db, owner_id, medicine_id)
    log = db.get(MedicineLog, log_id)
    if log is None or log.medicine_id != medicine.id:
        raise MedicineError("Log entry not found.", 404)

    log.status = "missed"
    db.commit()
    db.refresh(log)
    return log


def delete_log(db: Session, owner_id: str, medicine_id: str, log_id: str) -> None:
    medicine = get_medicine(db, owner_id, medicine_id)
    log = db.get(MedicineLog, log_id)
    if log is None or log.medicine_id != medicine.id:
        raise MedicineError("Log entry not found.", 404)
    db.delete(log)
    db.commit()


def count_upcoming_and_overdue(db: Session, owner_id: str) -> tuple[int, int]:
    now = _utcnow()
    stmt = (
        select(MedicineLog)
        .join(Medicine, Medicine.id == MedicineLog.medicine_id)
        .where(Medicine.owner_id == owner_id, MedicineLog.status == "pending")
    )
    logs = db.execute(stmt).scalars().all()
    upcoming = sum(1 for log in logs if log.scheduled_for >= now)
    overdue = sum(1 for log in logs if log.scheduled_for < now)
    return upcoming, overdue
