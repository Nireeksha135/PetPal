from sqlalchemy.orm import Session

from server.models.user import User
from server.schemas.dashboard import (
    DashboardStats,
    DashboardSummary,
    ActivityItem,
    ReminderItem,
)
from server.services.pet_service import count_pets
from server.services.medicine_service import count_upcoming_and_overdue as medicine_counts
from server.services.vaccination_service import count_upcoming_and_overdue as vaccination_counts
from server.services.deworming_service import count_upcoming_and_overdue as deworming_counts


def get_dashboard_summary(db: Session, user: User) -> DashboardSummary:
    """
    Aggregates dashboard data for the current user.

    Flea/tick and vet-visit reminders are added in later features.
    Medicine, vaccination, and deworming reminders are combined here.
    """
    total_pets = count_pets(db, user.id)

    med_upcoming, med_overdue = medicine_counts(db, user.id)
    vax_upcoming, vax_overdue = vaccination_counts(db, user.id)
    deworm_upcoming, deworm_overdue = deworming_counts(db, user.id)

    stats = DashboardStats(
        total_pets=total_pets,
        upcoming_reminders_count=med_upcoming + vax_upcoming + deworm_upcoming,
        overdue_reminders_count=med_overdue + vax_overdue + deworm_overdue,
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
