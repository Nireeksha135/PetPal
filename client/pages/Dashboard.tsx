import {
  Pill,
  Syringe,
  Stethoscope,
  Images,
  PawPrint,
  CalendarClock,
  ShieldAlert,
  Bell,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useDashboardSummary } from "@/hooks/useDashboardSummary";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import StatCard from "@/components/dashboard/StatCard";
import StatCardSkeleton from "@/components/dashboard/StatCardSkeleton";
import QuickActionCard from "@/components/dashboard/QuickActionCard";
import RecentActivity from "@/components/dashboard/RecentActivity";
import UpcomingReminders from "@/components/dashboard/UpcomingReminders";
import ErrorState from "@/components/ErrorState";

const quickActions = [
  {
    title: "Add a Pet",
    description: "Create a profile for a new pet",
    icon: PawPrint,
    to: "/pets/new",
  },
  {
    title: "Log Medicine",
    description: "Track a dose or prescription",
    icon: Pill,
    to: "/medicine",
  },
  {
    title: "Record Vaccination",
    description: "Keep vaccination records up to date",
    icon: Syringe,
    to: "/vaccinations",
  },
  {
    title: "Book Vet Visit",
    description: "Schedule or log a vet appointment",
    icon: Stethoscope,
    to: "/vet-visits",
  },
  {
    title: "Upload Documents",
    description: "Store medical records and reports",
    icon: ShieldAlert,
    to: "/documents",
  },
  {
    title: "Open Gallery",
    description: "Browse and add photos",
    icon: Images,
    to: "/gallery",
  },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { data, isLoading, isError, refetch } = useDashboardSummary();

  if (isError) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  const stats = data?.stats;
  const hasPets = data?.hasPets ?? false;

  return (
    <div className="flex flex-col gap-6">
      <WelcomeBanner fullName={user?.fullName} hasPets={hasPets} />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading || !stats ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              label="Total Pets"
              value={stats.totalPets}
              icon={PawPrint}
              accent="primary"
              index={0}
            />
            <StatCard
              label="Upcoming Reminders"
              value={stats.upcomingRemindersCount}
              icon={CalendarClock}
              accent="neutral"
              index={1}
            />
            <StatCard
              label="Overdue"
              value={stats.overdueRemindersCount}
              icon={Bell}
              accent="danger"
              index={2}
            />
            <StatCard
              label="Vet Visits This Month"
              value={stats.vetVisitsThisMonth}
              icon={Stethoscope}
              accent="warning"
              index={3}
            />
          </>
        )}
      </div>

      <div>
        <h2 className="mb-3 text-base font-semibold">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action, i) => (
            <QuickActionCard key={action.title} {...action} index={i} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentActivity
          items={data?.recentActivity ?? []}
          isLoading={isLoading}
        />
        <UpcomingReminders
          items={data?.upcomingReminders ?? []}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
