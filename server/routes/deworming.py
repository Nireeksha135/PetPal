from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from server.database.database import get_db
from server.auth.dependencies import get_current_user
from server.models.user import User
from server.schemas.deworming import DewormingRead, DewormingCreate, DewormingUpdate
from server.services.deworming_service import (
    list_deworming_for_pet,
    list_deworming_for_owner,
    get_deworming,
    create_deworming,
    update_deworming,
    delete_deworming,
    DewormingError,
)

router = APIRouter(prefix="/deworming", tags=["deworming"])


@router.get("", response_model=list[DewormingRead])
def get_deworming_records(
    pet_id: str | None = Query(default=None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        if pet_id:
            return list_deworming_for_pet(db, current_user.id, pet_id)
        return list_deworming_for_owner(db, current_user.id)
    except DewormingError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.post("", response_model=DewormingRead, status_code=201)
def post_deworming(
    payload: DewormingCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return create_deworming(db, current_user.id, payload)
    except DewormingError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.get("/{record_id}", response_model=DewormingRead)
def get_single_deworming(
    record_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return get_deworming(db, current_user.id, record_id)
    except DewormingError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.patch("/{record_id}", response_model=DewormingRead)
def patch_deworming(
    record_id: str,
    payload: DewormingUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return update_deworming(db, current_user.id, record_id, payload)
    except DewormingError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.delete("/{record_id}", status_code=204)
def delete_single_deworming(
    record_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        delete_deworming(db, current_user.id, record_id)
    except DewormingError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    return None
