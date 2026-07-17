from sqlalchemy.orm import Session

from server.models.user import User
from server.schemas.dashboard import (
    DashboardStats,
    DashboardSummary,
    ActivityItem,
    ReminderItem,
)
from server.services.pet_service import count_pets
from server.services.medicine_service import count_upcoming_and_overdue


def get_dashboard_summary(db: Session, user: User) -> DashboardSummary:
    """
    Aggregates dashboard data for the current user.

    Vaccination, deworming, flea/tick, and vet-visit reminders are added
    in later features. Medicine reminders are now sourced from the
    Medicine Tracker feature.
    """
    total_pets = count_pets(db, user.id)
    upcoming, overdue = count_upcoming_and_overdue(db, user.id)

    stats = DashboardStats(
        total_pets=total_pets,
        upcoming_reminders_count=upcoming,
        overdue_reminders_count=overdue,
        vet_visits_this_month=0,
    )

    recent_activity: list[ActivityItem] = []
    upcoming_reminders: list[ReminderItem] = []

    return DashboardSummary(
        stats=stats,
        recent_activity=recent_activity,
        upcoming_reminders=upcoming_reminders,
        has_pets=stats.total_pets > 0,
    )
