from sqlalchemy.orm import Session

from server.models.user import User
from server.schemas.dashboard import (
    DashboardStats,
    DashboardSummary,
    ActivityItem,
    ReminderItem,
)


def get_dashboard_summary(db: Session, user: User) -> DashboardSummary:
    """
    Aggregates dashboard data for the current user.

    Pet, reminder, and activity tables are introduced in later features
    (Pet Profile, Medicine Tracker, Vaccination Tracker, Vet Visit Manager).
    Until those models exist, a user has no pets, so the summary correctly
    reflects an empty state. This function is the single integration point
    those features will extend with real queries.
    """
    stats = DashboardStats(
        total_pets=0,
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
