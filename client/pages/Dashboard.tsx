import { useTransform } from "framer-motion";
import { motion } from "framer-motion";
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
import { usePageParallax } from "@/hooks/usePageParallax";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import StatCard from "@/components/dashboard/StatCard";
import StatCardSkeleton from "@/components/dashboard/StatCardSkeleton";
import QuickActionCard from "@/components/dashboard/QuickActionCard";
import RecentActivity from "@/components/dashboard/RecentActivity";
import UpcomingReminders from "@/components/dashboard/UpcomingReminders";
import ErrorState from "@/components/ErrorState";

const quickActions = [
  { title: "Add a Pet", description: "Create a profile for a new pet", icon: PawPrint, to: "/pets/new" },
  { title: "Log Medicine", description: "Track a dose or prescription", icon: Pill, to: "/medicine" },
  { title: "Record Vaccination", description: "Keep vaccination records up to date", icon: Syringe, to: "/vaccinations" },
  { title: "Book Vet Visit", description: "Schedule or log a vet appointment", icon: Stethoscope, to: "/vet-visits" },
  { title: "Upload Documents", description: "Store medical records and reports", icon: ShieldAlert, to: "/documents" },
  { title: "Open Gallery", description: "Browse and add photos", icon: Images, to: "/gallery" },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { data, isLoading, isError, refetch } = useDashboardSummary();
  const { x, y } = usePageParallax();

  // Foreground moves most with the cursor (closest to viewer),
  // midground barely moves, background drifts opposite and slowest —
  // the classic depth cue that sells "layers", not just decoration.
  const frontX = useTransform(x, (v) => v * 12);
  const frontY = useTransform(y, (v) => v * 8);
  const midX = useTransform(x, (v) => v * 4);
  const midY = useTransform(y, (v) => v * 3);
  const backX = useTransform(x, (v) => v * -5);
  const backY = useTransform(y, (v) => v * -3);

  if (isError) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  const stats = data?.stats;
  const hasPets = data?.hasPets ?? false;

  return (
    <div className="relative flex flex-col gap-8 [perspective:1600px]">
      {/* Layer 2 — midground: the main anchoring panel of the room */}
      <motion.div style={{ x: midX, y: midY }} className="relative z-20">
        <WelcomeBanner fullName={user?.fullName} hasPets={hasPets} />
      </motion.div>

      {/* Layer 1 — foreground: floating stat cards, pulled up to overlap
          the midground panel's lower edge, tilting toward the cursor */}
      <motion.div
        style={{ x: frontX, y: frontY }}
        className="relative z-30 -mt-6 grid grid-cols-2 gap-4 px-1 sm:grid-cols-2 lg:grid-cols-4"
      >
        {isLoading || !stats ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard label="Total Pets" value={stats.totalPets} icon={PawPrint} accent="primary" index={0} />
            <StatCard label="Upcoming Reminders" value={stats.upcomingRemindersCount} icon={CalendarClock} accent="sage" index={1} />
            <StatCard label="Overdue" value={stats.overdueRemindersCount} icon={Bell} accent="danger" index={2} />
            <StatCard label="Vet Visits This Month" value={stats.vetVisitsThisMonth} icon={Stethoscope} accent="warning" index={3} />
          </>
        )}
      </motion.div>

      {/* Midground plane continues: quick actions sit at the same depth
          as the welcome panel, crisp and static relative to the cursor */}
      <motion.div style={{ x: midX, y: midY }} className="relative z-20 mt-6">
        <h2 className="mb-3 text-title-lg">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action, i) => (
            <QuickActionCard key={action.title} {...action} index={i} />
          ))}
        </div>
      </motion.div>

      {/* Layer 3 — background: the room's larger anchored panels, set
          further back with a softer shadow and slower, counter-drifting
          parallax so they read as receded into the space */}
      <motion.div
        style={{ x: backX, y: backY }}
        className="relative z-0 mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2"
      >
        <div className="bg-card rim-light scale-[0.99] rounded-3xl p-6 shadow-soft">
          <RecentActivity items={data?.recentActivity ?? []} isLoading={isLoading} />
        </div>
        <div className="bg-card rim-light scale-[0.99] rounded-3xl p-6 shadow-soft">
          <UpcomingReminders items={data?.upcomingReminders ?? []} isLoading={isLoading} />
        </div>
      </motion.div>
    </div>
  );
}
