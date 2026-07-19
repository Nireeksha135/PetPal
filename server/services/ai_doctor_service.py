from sqlalchemy.orm import Session
from sqlalchemy import select

from server.models.ai_consultation import AIConsultation
from server.models.pet import Pet
from server.services.pet_service import get_pet, PetError
from server.services.gemini_client import get_text_model, get_vision_model, GeminiError
from server.services.storage_service import StorageError

import cloudinary
import cloudinary.uploader
from server.config import get_settings

settings = get_settings()
_configured = False


class AIDoctorError(Exception):
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(message)


ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024

SYSTEM_PROMPT = """You are PetPal's AI Pet Doctor, a supportive assistant that helps pet \
owners understand possible causes for symptoms they describe. You are NOT a licensed \
veterinarian and you must never present yourself as one.

Rules you must always follow:
- Give a brief, friendly, plain-language possible explanation for the symptoms described.
- Mention 2-4 possible non-emergency causes when appropriate, and clearly flag any signs \
that could indicate an emergency (e.g. difficulty breathing, suspected poisoning, collapse, \
severe bleeding, bloated abdomen, inability to urinate).
- ALWAYS include a clear recommendation to consult a licensed veterinarian for an accurate \
diagnosis and treatment, especially for anything serious or persistent, give remedies if the symptoms aren't that harmful.
- NEVER prescribe specific medications, dosages, or treatment plans.
- Keep the tone calm, warm, and reassuring, but honest about uncertainty.
- Keep the response under 300 words.
"""


def _ensure_cloudinary_configured() -> None:
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


def _build_prompt(pet: Pet, symptoms: str) -> str:
    age_info = f", born {pet.date_of_birth}" if pet.date_of_birth else ""
    return (
        f"{SYSTEM_PROMPT}\n\n"
        f"Pet details: {pet.name}, a {pet.species.value}"
        f"{f' ({pet.breed})' if pet.breed else ''}{age_info}, "
        f"gender: {pet.gender.value}.\n\n"
        f"Owner's description of the symptoms:\n{symptoms}"
    )


def _upload_image(file_bytes: bytes, content_type: str) -> str:
    if content_type not in ALLOWED_IMAGE_TYPES:
        raise AIDoctorError(
            "Unsupported file type. Please upload a JPEG, PNG, or WEBP image.", 415
        )
    if len(file_bytes) > MAX_IMAGE_SIZE_BYTES:
        raise AIDoctorError("Image is too large. Maximum size is 8MB.", 413)
    if not settings.CLOUDINARY_CLOUD_NAME:
        raise AIDoctorError("Image storage is not configured on the server yet.", 503)

    _ensure_cloudinary_configured()
    try:
        result = cloudinary.uploader.upload(
            file_bytes,
            folder="petpal/ai-consultations",
            resource_type="image",
        )
    except Exception as exc:
        raise AIDoctorError(f"Image upload failed: {exc}", 502)
    return result["secure_url"]


def create_consultation(
    db: Session,
    owner_id: str,
    pet_id: str,
    symptoms: str,
    image_bytes: bytes | None = None,
    image_content_type: str | None = None,
) -> AIConsultation:
    try:
        pet = get_pet(db, owner_id, pet_id)
    except PetError as e:
        raise AIDoctorError(e.message, e.status_code)

    image_url: str | None = None
    if image_bytes and image_content_type:
        image_url = _upload_image(image_bytes, image_content_type)

    prompt = _build_prompt(pet, symptoms)

    try:
        if image_bytes and image_content_type:
            model = get_vision_model()
            response = model.generate_content(
                [
                    prompt,
                    {"mime_type": image_content_type, "data": image_bytes},
                ]
            )
        else:
            model = get_text_model()
            response = model.generate_content(prompt)

        ai_text = (response.text or "").strip()
        if not ai_text:
            raise AIDoctorError("The AI didn't return a response. Please try again.", 502)
    except GeminiError as e:
        raise AIDoctorError(e.message, e.status_code)
    except Exception as exc:
        raise AIDoctorError(f"AI request failed: {exc}", 502)

    title = symptoms.strip()[:80] + ("..." if len(symptoms.strip()) > 80 else "")

    consultation = AIConsultation(
        owner_id=owner_id,
        pet_id=pet_id,
        symptoms=symptoms,
        image_url=image_url,
        ai_response=ai_text,
        title=title,
    )
    db.add(consultation)
    db.commit()
    db.refresh(consultation)
    return consultation


def list_consultations_for_pet(db: Session, owner_id: str, pet_id: str) -> list[AIConsultation]:
    try:
        get_pet(db, owner_id, pet_id)
    except PetError as e:
        raise AIDoctorError(e.message, e.status_code)

    stmt = (
        select(AIConsultation)
        .where(AIConsultation.pet_id == pet_id, AIConsultation.owner_id == owner_id)
        .order_by(AIConsultation.created_at.desc())
    )
    return list(db.execute(stmt).scalars().all())


def list_consultations_for_owner(db: Session, owner_id: str) -> list[AIConsultation]:
    stmt = (
        select(AIConsultation)
        .where(AIConsultation.owner_id == owner_id)
        .order_by(AIConsultation.created_at.desc())
    )
    return list(db.execute(stmt).scalars().all())


def get_consultation(db: Session, owner_id: str, consultation_id: str) -> AIConsultation:
    consultation = db.get(AIConsultation, consultation_id)
    if consultation is None or consultation.owner_id != owner_id:
        raise AIDoctorError("Consultation not found.", 404)
    return consultation


def delete_consultation(db: Session, owner_id: str, consultation_id: str) -> None:
    consultation = get_consultation(db, owner_id, consultation_id)
    db.delete(consultation)
    db.commit()
