from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from server.database.database import get_db
from server.auth.dependencies import get_current_user
from server.models.user import User
from server.schemas.diet_plan import DietPlanRequest, DietPlanRead
from server.services.diet_service import (
    generate_diet_plan,
    list_plans_for_pet,
    list_plans_for_owner,
    get_plan,
    delete_plan,
    DietError,
)

router = APIRouter(prefix="/diet-assistant", tags=["diet-assistant"])


@router.get("", response_model=list[DietPlanRead])
def get_plans(
    pet_id: str | None = Query(default=None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        if pet_id:
            return list_plans_for_pet(db, current_user.id, pet_id)
        return list_plans_for_owner(db, current_user.id)
    except DietError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.post("", response_model=DietPlanRead, status_code=201)
def post_plan(
    payload: DietPlanRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return generate_diet_plan(db, current_user.id, payload)
    except DietError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.get("/{plan_id}", response_model=DietPlanRead)
def get_single_plan(
    plan_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return get_plan(db, current_user.id, plan_id)
    except DietError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.delete("/{plan_id}", status_code=204)
def delete_single_plan(
    plan_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        delete_plan(db, current_user.id, plan_id)
    except DietError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    return None
