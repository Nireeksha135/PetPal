import cloudinary
import cloudinary.uploader

from server.config import get_settings

settings = get_settings()

_configured = False


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


class StorageError(Exception):
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(message)


ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024


def upload_pet_avatar(file_bytes: bytes, content_type: str, pet_id: str) -> str:
    if content_type not in ALLOWED_CONTENT_TYPES:
        raise StorageError(
            "Unsupported file type. Please upload a JPEG, PNG, or WEBP image.",
            415,
        )
    if len(file_bytes) > MAX_FILE_SIZE_BYTES:
        raise StorageError("File is too large. Maximum size is 5MB.", 413)

    if not settings.CLOUDINARY_CLOUD_NAME:
        raise StorageError(
            "Image storage is not configured on the server yet.", 503
        )

    _ensure_configured()

    result = cloudinary.uploader.upload(
        file_bytes,
        folder="petpal/pets",
        public_id=pet_id,
        overwrite=True,
        resource_type="image",
        transformation=[
            {"width": 512, "height": 512, "crop": "fill", "gravity": "auto"}
        ],
    )
    return result["secure_url"]
