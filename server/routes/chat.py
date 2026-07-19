from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from server.database.database import get_db
from server.auth.dependencies import get_current_user
from server.models.user import User
from server.schemas.chat import (
    ChatSessionRead,
    ChatSessionWithMessages,
    ChatSessionCreate,
    ChatMessageRead,
    SendMessageInput,
)
from server.services.chat_service import (
    list_sessions,
    get_session,
    create_session,
    delete_session,
    send_message,
    get_messages,
    ChatError,
)

router = APIRouter(prefix="/ask-petpal", tags=["ask-petpal"])


@router.get("/sessions", response_model=list[ChatSessionRead])
def get_sessions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return list_sessions(db, current_user.id)


@router.post("/sessions", response_model=ChatSessionRead, status_code=201)
def post_session(
    payload: ChatSessionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return create_session(db, current_user.id, payload.pet_id)
    except ChatError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.get("/sessions/{session_id}", response_model=ChatSessionWithMessages)
def get_single_session(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return get_session(db, current_user.id, session_id)
    except ChatError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.delete("/sessions/{session_id}", status_code=204)
def delete_single_session(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        delete_session(db, current_user.id, session_id)
    except ChatError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    return None


@router.get("/sessions/{session_id}/messages", response_model=list[ChatMessageRead])
def get_session_messages(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return get_messages(db, current_user.id, session_id)
    except ChatError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.post("/sessions/{session_id}/messages", response_model=ChatMessageRead, status_code=201)
def post_session_message(
    session_id: str,
    payload: SendMessageInput,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return send_message(db, current_user.id, session_id, payload.content)
    except ChatError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from server.database.database import get_db
from server.auth.dependencies import get_current_user
from server.models.user import User
from server.schemas.chat import (
    ChatSessionRead,
    ChatSessionWithMessages,
    ChatSessionCreate,
    ChatMessageRead,
    SendMessageInput,
)
from server.services.chat_service import (
    list_sessions,
    get_session,
    create_session,
    delete_session,
    send_message,
    get_messages,
    ChatError,
)

router = APIRouter(prefix="/ask-petpal", tags=["ask-petpal"])


@router.get("/sessions", response_model=list[ChatSessionRead])
def get_sessions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return list_sessions(db, current_user.id)


@router.post("/sessions", response_model=ChatSessionRead, status_code=201)
def post_session(
    payload: ChatSessionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return create_session(db, current_user.id, payload.pet_id)
    except ChatError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.get("/sessions/{session_id}", response_model=ChatSessionWithMessages)
def get_single_session(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return get_session(db, current_user.id, session_id)
    except ChatError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.delete("/sessions/{session_id}", status_code=204)
def delete_single_session(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        delete_session(db, current_user.id, session_id)
    except ChatError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    return None


@router.get("/sessions/{session_id}/messages", response_model=list[ChatMessageRead])
def get_session_messages(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return get_messages(db, current_user.id, session_id)
    except ChatError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.post("/sessions/{session_id}/messages", response_model=ChatMessageRead, status_code=201)
def post_session_message(
    session_id: str,
    payload: SendMessageInput,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return send_message(db, current_user.id, session_id, payload.content)
    except ChatError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
