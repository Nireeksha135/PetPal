import google.generativeai as genai

from server.config import get_settings

settings = get_settings()

_configured = False


class GeminiError(Exception):
    def __init__(self, message: str, status_code: int = 502):
        self.message = message
        self.status_code = status_code
        super().__init__(message)


def _ensure_configured() -> None:
    global _configured
    if _configured:
        return
    if not settings.GEMINI_API_KEY:
        raise GeminiError("AI features are not configured on the server yet.", 503)
    genai.configure(api_key=settings.GEMINI_API_KEY)
    _configured = True


def get_text_model() -> genai.GenerativeModel:
    _ensure_configured()
    return genai.GenerativeModel("gemini-1.5-flash")


def get_vision_model() -> genai.GenerativeModel:
    _ensure_configured()
    return genai.GenerativeModel("gemini-1.5-flash")
