from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from server.database.database import get_db
from server.auth.dependencies import get_current_user
from server.models.user import User
from server.schemas.vet_visit import VetVisitRead, VetVisitCreate, VetVisitUpdate
from server.services.vet_visit_service import (
    list_visits_for_pet,
    list_visits_for_owner,
    get_visit,
    create_visit,
    update_visit,
    delete_visit,
    VetVisitError,
)

router = APIRouter(prefix="/vet-visits", tags=["vet-visits"])


@router.get("", response_model=list[VetVisitRead])
def get_visits(
    pet_id: str | None = Query(default=None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        if pet_id:
            return list_visits_for_pet(db, current_user.id, pet_id)
        return list_visits_for_owner(db, current_user.id)
    except VetVisitError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.post("", response_model=VetVisitRead, status_code=201)
def post_visit(
    payload: VetVisitCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return create_visit(db, current_user.id, payload)
    except VetVisitError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.get("/{visit_id}", response_model=VetVisitRead)
def get_single_visit(
    visit_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return get_visit(db, current_user.id, visit_id)
    except VetVisitError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.patch("/{visit_id}", response_model=VetVisitRead)
def patch_visit(
    visit_id: str,
    payload: VetVisitUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return update_visit(db, current_user.id, visit_id, payload)
    except VetVisitError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.delete("/{visit_id}", status_code=204)
def delete_single_visit(
    visit_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        delete_visit(db, current_user.id, visit_id)
    except VetVisitError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    return None
