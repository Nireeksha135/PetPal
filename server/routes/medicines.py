from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from server.database.database import get_db
from server.auth.dependencies import get_current_user
from server.models.user import User
from server.schemas.medicine import (
    MedicineRead,
    MedicineCreate,
    MedicineUpdate,
    MedicineLogRead,
    MedicineLogCreate,
    MedicineLogMarkGiven,
)
from server.services.medicine_service import (
    list_medicines_for_pet,
    list_medicines_for_owner,
    get_medicine,
    create_medicine,
    update_medicine,
    delete_medicine,
    list_logs_for_medicine,
    create_log,
    mark_log_given,
    mark_log_missed,
    delete_log,
    MedicineError,
)

router = APIRouter(prefix="/medicines", tags=["medicines"])


@router.get("", response_model=list[MedicineRead])
def get_medicines(
    pet_id: str | None = Query(default=None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        if pet_id:
            return list_medicines_for_pet(db, current_user.id, pet_id)
        return list_medicines_for_owner(db, current_user.id)
    except MedicineError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.post("", response_model=MedicineRead, status_code=201)
def post_medicine(
    payload: MedicineCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return create_medicine(db, current_user.id, payload)
    except MedicineError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.get("/{medicine_id}", response_model=MedicineRead)
def get_single_medicine(
    medicine_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return get_medicine(db, current_user.id, medicine_id)
    except MedicineError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.patch("/{medicine_id}", response_model=MedicineRead)
def patch_medicine(
    medicine_id: str,
    payload: MedicineUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return update_medicine(db, current_user.id, medicine_id, payload)
    except MedicineError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.delete("/{medicine_id}", status_code=204)
def delete_single_medicine(
    medicine_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        delete_medicine(db, current_user.id, medicine_id)
    except MedicineError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    return None


@router.get("/{medicine_id}/logs", response_model=list[MedicineLogRead])
def get_logs(
    medicine_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return list_logs_for_medicine(db, current_user.id, medicine_id)
    except MedicineError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.post("/{medicine_id}/logs", response_model=MedicineLogRead, status_code=201)
def post_log(
    medicine_id: str,
    payload: MedicineLogCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return create_log(db, current_user.id, medicine_id, payload)
    except MedicineError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.post("/{medicine_id}/logs/{log_id}/given", response_model=MedicineLogRead)
def post_mark_given(
    medicine_id: str,
    log_id: str,
    payload: MedicineLogMarkGiven,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return mark_log_given(
            db, current_user.id, medicine_id, log_id, payload.given_at, payload.notes
        )
    except MedicineError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.post("/{medicine_id}/logs/{log_id}/missed", response_model=MedicineLogRead)
def post_mark_missed(
    medicine_id: str,
    log_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return mark_log_missed(db, current_user.id, medicine_id, log_id)
    except MedicineError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.delete("/{medicine_id}/logs/{log_id}", status_code=204)
def delete_single_log(
    medicine_id: str,
    log_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        delete_log(db, current_user.id, medicine_id, log_id)
    except MedicineError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    return None
