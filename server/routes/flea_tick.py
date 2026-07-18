from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from server.database.database import get_db
from server.auth.dependencies import get_current_user
from server.models.user import User
from server.schemas.flea_tick import FleaTickRead, FleaTickCreate, FleaTickUpdate
from server.services.flea_tick_service import (
    list_treatments_for_pet,
    list_treatments_for_owner,
    get_treatment,
    create_treatment,
    update_treatment,
    delete_treatment,
    FleaTickError,
)

router = APIRouter(prefix="/flea-tick", tags=["flea-tick"])


@router.get("", response_model=list[FleaTickRead])
def get_treatments(
    pet_id: str | None = Query(default=None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        if pet_id:
            return list_treatments_for_pet(db, current_user.id, pet_id)
        return list_treatments_for_owner(db, current_user.id)
    except FleaTickError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.post("", response_model=FleaTickRead, status_code=201)
def post_treatment(
    payload: FleaTickCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return create_treatment(db, current_user.id, payload)
    except FleaTickError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.get("/{treatment_id}", response_model=FleaTickRead)
def get_single_treatment(
    treatment_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return get_treatment(db, current_user.id, treatment_id)
    except FleaTickError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.patch("/{treatment_id}", response_model=FleaTickRead)
def patch_treatment(
    treatment_id: str,
    payload: FleaTickUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return update_treatment(db, current_user.id, treatment_id, payload)
    except FleaTickError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.delete("/{treatment_id}", status_code=204)
def delete_single_treatment(
    treatment_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        delete_treatment(db, current_user.id, treatment_id)
    except FleaTickError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    return None
