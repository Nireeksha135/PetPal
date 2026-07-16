from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from server.database.database import get_db
from server.auth.dependencies import get_current_user
from server.models.user import User
from server.schemas.dashboard import DashboardSummary
from server.services.dashboard_service import get_dashboard_summary

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/summary", response_model=DashboardSummary)
def dashboard_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_dashboard_summary(db, current_user)
