import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold">
              P
            </div>
            <span className="text-lg font-semibold tracking-tight">
              PetPal
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10 animate-fade-in">
        <Outlet />
      </main>
    </div>
  );
}
