import { Menu, Bell, Search } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import UserMenu from "./UserMenu";
import Breadcrumbs from "./Breadcrumbs";

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open navigation"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
          >
            <Menu size={20} />
          </button>
          <Breadcrumbs />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Search"
            title="Search — coming soon"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Search size={18} />
          </button>
          <button
            type="button"
            aria-label="Notifications"
            title="Notifications — coming soon"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Bell size={18} />
          </button>
          <ThemeToggle />
          <div className="mx-1 h-6 w-px bg-border" />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
