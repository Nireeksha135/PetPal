import { navigation } from "@/config/navigation";
import { cn } from "@/utils/cn";
import NavItem from "./NavItem";

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export default function Sidebar({ className, onNavigate }: SidebarProps) {
  return (
    <nav
      className={cn(
        "flex h-full w-64 flex-col gap-6 overflow-y-auto border-r border-border bg-card px-4 py-6 scrollbar-none",
        className,
      )}
      aria-label="Main navigation"
    >
      <div className="flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold">
          P
        </div>
        <span className="text-lg font-semibold tracking-tight">PetPal</span>
      </div>

      <div className="flex flex-1 flex-col gap-6">
        {navigation.map((group) => (
          <div key={group.title} className="flex flex-col gap-1">
            <span className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
              {group.title}
            </span>
            {group.items.map((item) => (
              <NavItem key={item.path} item={item} onNavigate={onNavigate} />
            ))}
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-accent px-3 py-3 text-xs text-accent-foreground">
        More features are rolling out feature-by-feature. Locked items unlock
        soon.
      </div>
    </nav>
  );
}
