from sqlalchemy.orm import Session
from sqlalchemy import select

from server.models.document import MedicalDocument, DocumentCategory
from server.schemas.document import DocumentUpdate
from server.services.pet_service import get_pet, PetError
from server.services.storage_service import StorageError

import cloudinary
import cloudinary.uploader
from server.config import get_settings

settings = get_settings()
_configured = False


class DocumentError(Exception):
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(message)


ALLOWED_DOCUMENT_TYPES = {
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
}
MAX_DOCUMENT_SIZE_BYTES = 15 * 1024 * 1024


def _ensure_configured() -> None:
    global _configured
    if _configured:
        return
    cloudinary.config(
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        api_key=settings.CLOUDINARY_API_KEY,
        api_secret=settings.CLOUDINARY_API_SECRET,
        secure=True,
    )
    _configured = True


def list_documents_for_pet(db: Session, owner_id: str, pet_id: str) -> list[MedicalDocument]:
    try:
        get_pet(db, owner_id, pet_id)
    except PetError as e:
        raise DocumentError(e.message, e.status_code)

    stmt = (
        select(MedicalDocument)
        .where(MedicalDocument.pet_id == pet_id, MedicalDocument.owner_id == owner_id)
        .order_by(MedicalDocument.created_at.desc())
    )
    return list(db.execute(stmt).scalars().all())


def list_documents_for_owner(db: Session, owner_id: str) -> list[MedicalDocument]:
    stmt = (
        select(MedicalDocument)
        .where(MedicalDocument.owner_id == owner_id)
        .order_by(MedicalDocument.created_at.desc())
    )
    return list(db.execute(stmt).scalars().all())


def get_document(db: Session, owner_id: str, document_id: str) -> MedicalDocument:
    document = db.get(MedicalDocument, document_id)
    if document is None or document.owner_id != owner_id:
        raise DocumentError("Document not found.", 404)
    return document


def upload_document(
    db: Session,
    owner_id: str,
    pet_id: str,
    title: str,
    category: DocumentCategory,
    file_bytes: bytes,
    content_type: str,
    file_name: str,
    notes: str | None = None,
) -> MedicalDocument:
    try:
        get_pet(db, owner_id, pet_id)
    except PetError as e:
        raise DocumentError(e.message, e.status_code)

    if content_type not in ALLOWED_DOCUMENT_TYPES:
        raise DocumentError(
            "Unsupported file type. Please upload a PDF, JPEG, PNG, or WEBP file.",
            415,
        )
    if len(file_bytes) > MAX_DOCUMENT_SIZE_BYTES:
        raise DocumentError("File is too large. Maximum size is 15MB.", 413)

    if not settings.CLOUDINARY_CLOUD_NAME:
        raise DocumentError("Document storage is not configured on the server yet.", 503)

    _ensure_configured()

    resource_type = "raw" if content_type == "application/pdf" else "image"

    try:
        result = cloudinary.uploader.upload(
            file_bytes,
            folder="petpal/documents",
            resource_type=resource_type,
            use_filename=True,
            unique_filename=True,
        )
    except Exception as exc:
        raise DocumentError(f"Upload failed: {exc}", 502)

    document = MedicalDocument(
        owner_id=owner_id,
        pet_id=pet_id,
        title=title.strip(),
        category=category,
        file_url=result["secure_url"],
        file_name=file_name,
        file_type=content_type,
        file_size_bytes=len(file_bytes),
        notes=notes,
    )
    db.add(document)
    db.commit()
    db.refresh(document)
    return document


def update_document(
    db: Session, owner_id: str, document_id: str, payload: DocumentUpdate
) -> MedicalDocument:
    document = get_document(db, owner_id, document_id)
    updates = payload.model_dump(exclude_unset=True)
    for field, value in updates.items():
        setattr(document, field, value)
    db.commit()
    db.refresh(document)
    return document


def delete_document(db: Session, owner_id: str, document_id: str) -> None:
    document = get_document(db, owner_id, document_id)
    db.delete(document)
    db.commit()


def count_documents(db: Session, owner_id: str) -> int:
    return db.query(MedicalDocument).filter(MedicalDocument.owner_id == owner_id).count()
