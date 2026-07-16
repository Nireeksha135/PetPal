from pydantic import BaseModel


class DashboardStats(BaseModel):
    total_pets: int
    upcoming_reminders_count: int
    overdue_reminders_count: int
    vet_visits_this_month: int


class ActivityItem(BaseModel):
    id: str
    type: str
    title: str
    description: str
    timestamp: str
    icon: str


class ReminderItem(BaseModel):
    id: str
    pet_name: str
    title: str
    category: str
    due_date: str
    status: str


class DashboardSummary(BaseModel):
    stats: DashboardStats
    recent_activity: list[ActivityItem]
    upcoming_reminders: list[ReminderItem]
    has_pets: bool
