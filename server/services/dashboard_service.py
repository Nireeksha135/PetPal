from sqlalchemy.orm import Session

from server.models.user import User
from server.schemas.dashboard import (
    DashboardStats,
    DashboardSummary,
    ActivityItem,
    ReminderItem,
)
from server.services.pet_service import count_pets


def get_dashboard_summary(db: Session, user: User) -> DashboardSummary:
    """
    Aggregates dashboard data for the current user.

    Reminder and activity tables are introduced in later features
    (Medicine Tracker, Vaccination Tracker, Vet Visit Manager). Until
    those models exist, those counts stay at zero. Pet count is now
    real, sourced from the Pet Profile feature.
    """
    total_pets = count_pets(db, user.id)

    stats = DashboardStats(
        total_pets=total_pets,
        upcoming_reminders_count=0,
        overdue_reminders_count=0,
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
