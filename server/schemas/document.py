from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field, field_validator

from server.models.document import DocumentCategory


class DocumentUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=150)
    category: DocumentCategory | None = None
    notes: str | None = Field(default=None, max_length=1000)

    @field_validator("title")
    @classmethod
    def title_not_blank(cls, value: str | None) -> str | None:
        if value is None:
            return value
        stripped = value.strip()
        if not stripped:
            raise ValueError("Title cannot be blank.")
        return stripped


class DocumentRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    pet_id: str
    owner_id: str
    title: str
    category: DocumentCategory
    file_url: str
    file_name: str
    file_type: str
    file_size_bytes: int
    notes: str | None = None
    created_at: datetime
    updated_at: datetime
