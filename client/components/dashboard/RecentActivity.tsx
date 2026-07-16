import { Activity as ActivityIcon } from "lucide-react";
import type { ActivityItem } from "@/types/dashboard";
import EmptyState from "@/components/EmptyState";
import Skeleton from "@/components/Skeleton";

interface RecentActivityProps {
  items: ActivityItem[];
  isLoading: boolean;
}

export default function RecentActivity({
  items,
  isLoading,
}: RecentActivityProps) {
  return (
    <div className="rounded-2xl bg-card p-6 shadow-card">
      <h2 className="text-base font-semibold">Recent Activity</h2>

      {isLoading ? (
        <div className="mt-4 flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="flex flex-1 flex-col gap-1.5">
                <Skeleton className="h-3.5 w-3/5" />
                <Skeleton className="h-3 w-2/5" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="mt-2">
          <EmptyState
            icon={ActivityIcon}
            title="No activity yet"
            description="Once you add a pet and start tracking their care, updates will show up here."
          />
        </div>
      ) : (
        <ul className="mt-4 flex flex-col gap-4">
          {items.map((item) => (
            <li key={item.id} className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs font-semibold">
                {item.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{item.title}</span>
                <span className="text-xs text-muted-foreground">
                  {item.description}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
