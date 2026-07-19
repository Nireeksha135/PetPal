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
from server.services.flea_tick_service import count_upcoming_and_overdue as flea_tick_counts
from server.services.vet_visit_service import (
    count_visits_this_month,
    count_upcoming_follow_ups,
)

def get_dashboard_summary(db: Session, user: User) -> DashboardSummary:
    """
    Aggregates dashboard data for the current user.

    All health-tracking features (Medicine, Vaccinations, Deworming,
    Flea & Tick, Vet Visits) now feed into the reminder counts and
    vet-visit stat. Recent activity and upcoming reminder lists remain
    a future enhancement (Notifications/Analytics features).
    """
    total_pets = count_pets(db, user.id)

    med_upcoming, med_overdue = medicine_counts(db, user.id)
    vax_upcoming, vax_overdue = vaccination_counts(db, user.id)
    deworm_upcoming, deworm_overdue = deworming_counts(db, user.id)
    flea_upcoming, flea_overdue = flea_tick_counts(db, user.id)
    followup_upcoming, followup_overdue = count_upcoming_follow_ups(db, user.id)

    stats = DashboardStats(
        total_pets=total_pets,
        upcoming_reminders_count=(
            med_upcoming + vax_upcoming + deworm_upcoming + flea_upcoming + followup_upcoming
        ),
        overdue_reminders_count=(
            med_overdue + vax_overdue + deworm_overdue + flea_overdue + followup_overdue
        ),
        vet_visits_this_month=count_visits_this_month(db, user.id),
    )

    recent_activity: list[ActivityItem] = []
    upcoming_reminders: list[ReminderItem] = []

    return DashboardSummary(
        stats=stats,
        recent_activity=recent_activity,
        upcoming_reminders=upcoming_reminders,
        has_pets=stats.total_pets > 0,
    )
