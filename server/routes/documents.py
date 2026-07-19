from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Form
from sqlalchemy.orm import Session

from server.database.database import get_db
from server.auth.dependencies import get_current_user
from server.models.user import User
from server.models.document import DocumentCategory
from server.schemas.document import DocumentRead, DocumentUpdate
from server.services.document_service import (
    list_documents_for_pet,
    list_documents_for_owner,
    get_document,
    upload_document,
    update_document,
    delete_document,
    DocumentError,
)

router = APIRouter(prefix="/documents", tags=["documents"])


@router.get("", response_model=list[DocumentRead])
def get_documents(
    pet_id: str | None = Query(default=None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        if pet_id:
            return list_documents_for_pet(db, current_user.id, pet_id)
        return list_documents_for_owner(db, current_user.id)
    except DocumentError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.post("", response_model=DocumentRead, status_code=201)
async def post_document(
    pet_id: str = Form(...),
    title: str = Form(...),
    category: DocumentCategory = Form(default=DocumentCategory.OTHER),
    notes: str | None = Form(default=None),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        file_bytes = await file.read()
        return upload_document(
            db,
            current_user.id,
            pet_id,
            title,
            category,
            file_bytes,
            file.content_type or "",
            file.filename or "document",
            notes,
        )
    except DocumentError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.get("/{document_id}", response_model=DocumentRead)
def get_single_document(
    document_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return get_document(db, current_user.id, document_id)
    except DocumentError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.patch("/{document_id}", response_model=DocumentRead)
def patch_document(
    document_id: str,
    payload: DocumentUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return update_document(db, current_user.id, document_id, payload)
    except DocumentError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.delete("/{document_id}", status_code=204)
def delete_single_document(
    document_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        delete_document(db, current_user.id, document_id)
    except DocumentError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    return None
