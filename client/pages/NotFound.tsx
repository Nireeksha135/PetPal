import { Link } from "react-router-dom";
import Button from "@/components/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <span className="text-6xl font-bold text-primary/30">404</span>
      <h1 className="text-2xl font-bold tracking-tight">Page not found</h1>
      <p className="max-w-sm text-muted-foreground">
        The page you're looking for doesn't exist or hasn't been built yet.
      </p>
      <Link to="/dashboard">
        <Button>Back to Dashboard</Button>
      </Link>
    </div>
  );
}
