import { NavLink } from "react-router-dom";
import { Lock } from "lucide-react";
import { cn } from "@/utils/cn";
import type { NavItemConfig } from "@/config/navigation";

interface NavItemProps {
  item: NavItemConfig;
  onNavigate?: () => void;
}

export default function NavItem({ item, onNavigate }: NavItemProps) {
  const { label, path, icon: Icon, enabled } = item;

  if (!enabled) {
    return (
      <div
        className={cn(
          "group flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
          "cursor-not-allowed text-muted-foreground/50",
        )}
        aria-disabled="true"
        title={`${label} — coming soon`}
      >
        <span className="flex items-center gap-3">
          <Icon size={18} strokeWidth={2} />
          {label}
        </span>
        <Lock size={13} className="opacity-60" />
      </div>
    );
  }

  return (
    <NavLink
      to={path}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-foreground/80 hover:bg-muted hover:text-foreground",
        )
      }
      end={path === "/dashboard"}
    >
      <Icon size={18} strokeWidth={2} />
      {label}
    </NavLink>
  );
}
