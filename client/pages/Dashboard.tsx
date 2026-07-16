import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl bg-card p-8 shadow-card">
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome, {user?.fullName ?? "friend"} 👋
        </h1>
        <p className="mt-2 text-muted-foreground">
          Your global layout and navigation are ready. The full dashboard
          with pet stats and widgets is coming up in Feature 4.
        </p>
      </div>
    </div>
  );
}
