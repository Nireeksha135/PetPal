import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { findNavItemByPath } from "@/config/navigation";

export default function Breadcrumbs() {
  const location = useLocation();
  const current = findNavItemByPath(location.pathname);

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1.5 text-sm text-muted-foreground"
    >
      <Link
        to="/dashboard"
        className="flex items-center gap-1 hover:text-foreground"
      >
        <Home size={14} />
      </Link>
      {current && (
        <>
          <ChevronRight size={14} />
          <span className="font-medium text-foreground">
            {current.label}
          </span>
        </>
      )}
    </nav>
  );
}
