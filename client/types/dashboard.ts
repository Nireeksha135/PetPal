export interface DashboardStats {
  totalPets: number;
  upcomingRemindersCount: number;
  overdueRemindersCount: number;
  vetVisitsThisMonth: number;
}

export interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  icon: string;
}

export interface ReminderItem {
  id: string;
  petName: string;
  title: string;
  category: string;
  dueDate: string;
  status: string;
}

export interface DashboardSummary {
  stats: DashboardStats;
  recentActivity: ActivityItem[];
  upcomingReminders: ReminderItem[];
  hasPets: boolean;
}

interface RawDashboardStats {
  total_pets: number;
  upcoming_reminders_count: number;
  overdue_reminders_count: number;
  vet_visits_this_month: number;
}

interface RawActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  icon: string;
}

interface RawReminderItem {
  id: string;
  pet_name: string;
  title: string;
  category: string;
  due_date: string;
  status: string;
}

export interface RawDashboardSummary {
  stats: RawDashboardStats;
  recent_activity: RawActivityItem[];
  upcoming_reminders: RawReminderItem[];
  has_pets: boolean;
}

export function mapDashboardSummary(
  raw: RawDashboardSummary,
): DashboardSummary {
  return {
    stats: {
      totalPets: raw.stats.total_pets,
      upcomingRemindersCount: raw.stats.upcoming_reminders_count,
      overdueRemindersCount: raw.stats.overdue_reminders_count,
      vetVisitsThisMonth: raw.stats.vet_visits_this_month,
    },
    recentActivity: raw.recent_activity.map((item) => ({
      id: item.id,
      type: item.type,
      title: item.title,
      description: item.description,
      timestamp: item.timestamp,
      icon: item.icon,
    })),
    upcomingReminders: raw.upcoming_reminders.map((item) => ({
      id: item.id,
      petName: item.pet_name,
      title: item.title,
      category: item.category,
      dueDate: item.due_date,
      status: item.status,
    })),
    hasPets: raw.has_pets,
  };
}
