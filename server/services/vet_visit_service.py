from datetime import date
from sqlalchemy.orm import Session
from sqlalchemy import select, extract

from server.models.vet_visit import VetVisit
from server.schemas.vet_visit import VetVisitCreate, VetVisitUpdate
from server.services.pet_service import get_pet, PetError


class VetVisitError(Exception):
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(message)


def list_visits_for_pet(db: Session, owner_id: str, pet_id: str) -> list[VetVisit]:
    try:
        get_pet(db, owner_id, pet_id)
    except PetError as e:
        raise VetVisitError(e.message, e.status_code)

    stmt = (
        select(VetVisit)
        .where(VetVisit.pet_id == pet_id, VetVisit.owner_id == owner_id)
        .order_by(VetVisit.visit_date.desc())
    )
    return list(db.execute(stmt).scalars().all())


def list_visits_for_owner(db: Session, owner_id: str) -> list[VetVisit]:
    stmt = (
        select(VetVisit)
        .where(VetVisit.owner_id == owner_id)
        .order_by(VetVisit.visit_date.desc())
    )
    return list(db.execute(stmt).scalars().all())


def get_visit(db: Session, owner_id: str, visit_id: str) -> VetVisit:
    visit = db.get(VetVisit, visit_id)
    if visit is None or visit.owner_id != owner_id:
        raise VetVisitError("Vet visit not found.", 404)
    return visit


def create_visit(db: Session, owner_id: str, payload: VetVisitCreate) -> VetVisit:
    try:
        get_pet(db, owner_id, payload.pet_id)
    except PetError as e:
        raise VetVisitError(e.message, e.status_code)

    data = payload.model_dump(exclude={"pet_id"})
    visit = VetVisit(owner_id=owner_id, pet_id=payload.pet_id, **data)
    db.add(visit)
    db.commit()
    db.refresh(visit)
    return visit


def update_visit(
    db: Session, owner_id: str, visit_id: str, payload: VetVisitUpdate
) -> VetVisit:
    visit = get_visit(db, owner_id, visit_id)
    updates = payload.model_dump(exclude_unset=True)
    for field, value in updates.items():
        setattr(visit, field, value)
    db.commit()
    db.refresh(visit)
    return visit


def delete_visit(db: Session, owner_id: str, visit_id: str) -> None:
    visit = get_visit(db, owner_id, visit_id)
    db.delete(visit)
    db.commit()


def count_visits_this_month(db: Session, owner_id: str) -> int:
    today = date.today()
    stmt = select(VetVisit).where(
        VetVisit.owner_id == owner_id,
        extract("year", VetVisit.visit_date) == today.year,
        extract("month", VetVisit.visit_date) == today.month,
    )
    return len(db.execute(stmt).scalars().all())


def count_upcoming_follow_ups(db: Session, owner_id: str, window_days: int = 30) -> tuple[int, int]:
    from datetime import timedelta

    today = date.today()
    horizon = today + timedelta(days=window_days)

    stmt = select(VetVisit).where(
        VetVisit.owner_id == owner_id,
        VetVisit.follow_up_needed.is_(True),
        VetVisit.follow_up_date.is_not(None),
    )
    visits = db.execute(stmt).scalars().all()

    upcoming = sum(
        1 for v in visits if v.follow_up_date and today <= v.follow_up_date <= horizon
    )
    overdue = sum(1 for v in visits if v.follow_up_date and v.follow_up_date < today)
    return upcoming, overdue
