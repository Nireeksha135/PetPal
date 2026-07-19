from sqlalchemy.orm import Session
from sqlalchemy import select

from server.models.chat import ChatSession, ChatMessage
from server.models.pet import Pet
from server.services.gemini_client import get_text_model, GeminiError
from server.services.pet_service import get_pet, PetError


class ChatError(Exception):
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(message)


SYSTEM_PROMPT = """You are "Ask PetPal", a friendly and knowledgeable pet-care assistant \
built into the PetPal app. You help pet owners with everyday questions about pet care: \
nutrition, behavior, training, grooming, general wellness, and product recommendations.

Guidelines:
- Be warm, conversational, and concise (usually 2-4 short paragraphs or a short list).
- You are NOT a veterinarian. For anything that sounds like a medical symptom, a health \
concern, or something requiring diagnosis, gently redirect the person to the AI Pet Doctor \
feature or a licensed veterinarian instead of guessing.
- Never prescribe medications or dosages.
- If the conversation includes context about a specific pet (name, species, breed, age), \
personalize your answers using those details.
- Keep responses focused and avoid unnecessary caveats or repetition.
"""


def _build_pet_context(pet: Pet | None) -> str:
    if pet is None:
        return ""
    age_info = f", born {pet.date_of_birth}" if pet.date_of_birth else ""
    return (
        f"\n\nContext about the pet being discussed: {pet.name}, a "
        f"{pet.species.value}{f' ({pet.breed})' if pet.breed else ''}{age_info}, "
        f"gender: {pet.gender.value}."
    )


def list_sessions(db: Session, owner_id: str) -> list[ChatSession]:
    stmt = (
        select(ChatSession)
        .where(ChatSession.owner_id == owner_id)
        .order_by(ChatSession.updated_at.desc())
    )
    return list(db.execute(stmt).scalars().all())


def get_session(db: Session, owner_id: str, session_id: str) -> ChatSession:
    session = db.get(ChatSession, session_id)
    if session is None or session.owner_id != owner_id:
        raise ChatError("Conversation not found.", 404)
    return session


def create_session(db: Session, owner_id: str, pet_id: str | None) -> ChatSession:
    if pet_id:
        try:
            get_pet(db, owner_id, pet_id)
        except PetError as e:
            raise ChatError(e.message, e.status_code)

    session = ChatSession(owner_id=owner_id, pet_id=pet_id, title="New Conversation")
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


def delete_session(db: Session, owner_id: str, session_id: str) -> None:
    session = get_session(db, owner_id, session_id)
    db.delete(session)
    db.commit()


def _derive_title(first_message: str) -> str:
    stripped = first_message.strip()
    return stripped[:60] + ("..." if len(stripped) > 60 else "")


def send_message(db: Session, owner_id: str, session_id: str, content: str) -> ChatMessage:
    session = get_session(db, owner_id, session_id)

    pet = None
    if session.pet_id:
        try:
            pet = get_pet(db, owner_id, session.pet_id)
        except PetError:
            pet = None

    is_first_message = len(session.messages) == 0

    user_message = ChatMessage(session_id=session.id, role="user", content=content)
    db.add(user_message)
    db.flush()

    history = [
        {"role": "user" if m.role == "user" else "model", "parts": [m.content]}
        for m in session.messages
        if m.id != user_message.id
    ]

    try:
        model = get_text_model()
        system_context = SYSTEM_PROMPT + _build_pet_context(pet)
        chat = model.start_chat(
            history=[{"role": "user", "parts": [system_context]}, {"role": "model", "parts": ["Understood, I'm ready to help."]}] + history
        )
        response = chat.send_message(content)
        ai_text = (response.text or "").strip()
        if not ai_text:
            raise ChatError("The assistant didn't return a response. Please try again.", 502)
    except GeminiError as e:
        raise ChatError(e.message, e.status_code)
    except Exception as exc:
        raise ChatError(f"Chat request failed: {exc}", 502)

    ai_message = ChatMessage(session_id=session.id, role="assistant", content=ai_text)
    db.add(ai_message)

    if is_first_message:
        session.title = _derive_title(content)

    db.commit()
    db.refresh(ai_message)
    return ai_message


def get_messages(db: Session, owner_id: str, session_id: str) -> list[ChatMessage]:
    session = get_session(db, owner_id, session_id)
    return list(session.messages)
