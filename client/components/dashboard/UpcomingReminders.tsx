import { CalendarClock } from "lucide-react";
import type { ReminderItem } from "@/types/dashboard";
import EmptyState from "@/components/EmptyState";
import Skeleton from "@/components/Skeleton";
import { cn } from "@/utils/cn";

interface UpcomingRemindersProps {
  items: ReminderItem[];
  isLoading: boolean;
}

const statusStyles: Record<string, string> = {
  overdue: "bg-destructive/10 text-destructive",
  upcoming: "bg-primary/10 text-primary",
  today: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

export default function UpcomingReminders({
  items,
  isLoading,
}: UpcomingRemindersProps) {
  return (
    <div className="rounded-2xl bg-card p-6 shadow-card">
      <h2 className="text-base font-semibold">Upcoming Reminders</h2>

      {isLoading ? (
        <div className="mt-4 flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="mt-2">
          <EmptyState
            icon={CalendarClock}
            title="Nothing due"
            description="Vaccinations, medicine, and vet visit reminders will appear here as they come up."
          />
        </div>
      ) : (
        <ul className="mt-4 flex flex-col gap-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between rounded-xl border border-border px-4 py-3"
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium">{item.title}</span>
                <span className="text-xs text-muted-foreground">
                  {item.petName} · {item.dueDate}
                </span>
              </div>
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-medium capitalize",
                  statusStyles[item.status] ?? statusStyles.upcoming,
                )}
              >
                {item.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
