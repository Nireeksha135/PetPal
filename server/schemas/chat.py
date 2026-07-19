from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field, field_validator


class ChatMessageRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    session_id: str
    role: str
    content: str
    created_at: datetime


class ChatSessionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    owner_id: str
    pet_id: str | None = None
    title: str
    created_at: datetime
    updated_at: datetime


class ChatSessionWithMessages(ChatSessionRead):
    messages: list[ChatMessageRead] = []


class ChatSessionCreate(BaseModel):
    pet_id: str | None = None


class SendMessageInput(BaseModel):
    content: str = Field(min_length=1, max_length=2000)

    @field_validator("content")
    @classmethod
    def not_blank(cls, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError("Message cannot be blank.")
        return stripped
