from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from server.database.database import get_db
from server.auth.dependencies import get_current_user
from server.models.user import User
from server.schemas.vaccination import (
    VaccinationRead,
    VaccinationCreate,
    VaccinationUpdate,
)
from server.services.vaccination_service import (
    list_vaccinations_for_pet,
    list_vaccinations_for_owner,
    get_vaccination,
    create_vaccination,
    update_vaccination,
    delete_vaccination,
    VaccinationError,
)

router = APIRouter(prefix="/vaccinations", tags=["vaccinations"])


@router.get("", response_model=list[VaccinationRead])
def get_vaccinations(
    pet_id: str | None = Query(default=None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        if pet_id:
            return list_vaccinations_for_pet(db, current_user.id, pet_id)
        return list_vaccinations_for_owner(db, current_user.id)
    except VaccinationError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.post("", response_model=VaccinationRead, status_code=201)
def post_vaccination(
    payload: VaccinationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return create_vaccination(db, current_user.id, payload)
    except VaccinationError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.get("/{vaccination_id}", response_model=VaccinationRead)
def get_single_vaccination(
    vaccination_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return get_vaccination(db, current_user.id, vaccination_id)
    except VaccinationError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.patch("/{vaccination_id}", response_model=VaccinationRead)
def patch_vaccination(
    vaccination_id: str,
    payload: VaccinationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return update_vaccination(db, current_user.id, vaccination_id, payload)
    except VaccinationError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.delete("/{vaccination_id}", status_code=204)
def delete_single_vaccination(
    vaccination_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        delete_vaccination(db, current_user.id, vaccination_id)
    except VaccinationError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    return None
