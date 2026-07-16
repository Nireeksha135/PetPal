from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from server.database.database import get_db
from server.auth.dependencies import get_current_user
from server.models.user import User
from server.schemas.pet import PetRead, PetListItem, PetCreate, PetUpdate
from server.services.pet_service import (
    list_pets,
    get_pet,
    create_pet,
    update_pet,
    delete_pet,
    PetError,
)

router = APIRouter(prefix="/pets", tags=["pets"])


@router.get("", response_model=list[PetListItem])
def get_pets(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return list_pets(db, current_user.id)


@router.post("", response_model=PetRead, status_code=201)
def post_pet(
    payload: PetCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return create_pet(db, current_user.id, payload)


@router.get("/{pet_id}", response_model=PetRead)
def get_single_pet(
    pet_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return get_pet(db, current_user.id, pet_id)
    except PetError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.patch("/{pet_id}", response_model=PetRead)
def patch_pet(
    pet_id: str,
    payload: PetUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return update_pet(db, current_user.id, pet_id, payload)
    except PetError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.delete("/{pet_id}", status_code=204)
def delete_single_pet(
    pet_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        delete_pet(db, current_user.id, pet_id)
    except PetError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    return None
