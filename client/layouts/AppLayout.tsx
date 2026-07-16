import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/navigation/Sidebar";
import MobileNav from "@/components/navigation/MobileNav";
import Topbar from "@/components/navigation/Topbar";

export default function AppLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar className="hidden lg:flex" />
      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar onMenuClick={() => setMobileNavOpen(true)} />
        <main className="flex-1 px-4 py-6 animate-fade-in sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
