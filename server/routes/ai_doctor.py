from fastapi import APIRouter, Depends, HTTPException, Query, Form, UploadFile, File
from sqlalchemy.orm import Session

from server.database.database import get_db
from server.auth.dependencies import get_current_user
from server.models.user import User
from server.schemas.ai_consultation import AIConsultationRead
from server.services.ai_doctor_service import (
    create_consultation,
    list_consultations_for_pet,
    list_consultations_for_owner,
    get_consultation,
    delete_consultation,
    AIDoctorError,
)

router = APIRouter(prefix="/ai-pet-doctor", tags=["ai-pet-doctor"])


@router.get("", response_model=list[AIConsultationRead])
def get_consultations(
    pet_id: str | None = Query(default=None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        if pet_id:
            return list_consultations_for_pet(db, current_user.id, pet_id)
        return list_consultations_for_owner(db, current_user.id)
    except AIDoctorError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.post("", response_model=AIConsultationRead, status_code=201)
async def post_consultation(
    pet_id: str = Form(...),
    symptoms: str = Form(...),
    file: UploadFile | None = File(default=None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if len(symptoms.strip()) < 10:
        raise HTTPException(
            status_code=422,
            detail="Please describe the symptoms in a bit more detail.",
        )

    image_bytes: bytes | None = None
    image_content_type: str | None = None
    if file is not None:
        image_bytes = await file.read()
        image_content_type = file.content_type

    try:
        return create_consultation(
            db,
            current_user.id,
            pet_id,
            symptoms.strip(),
            image_bytes,
            image_content_type,
        )
    except AIDoctorError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.get("/{consultation_id}", response_model=AIConsultationRead)
def get_single_consultation(
    consultation_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return get_consultation(db, current_user.id, consultation_id)
    except AIDoctorError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.delete("/{consultation_id}", status_code=204)
def delete_single_consultation(
    consultation_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        delete_consultation(db, current_user.id, consultation_id)
    except AIDoctorError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    return None
