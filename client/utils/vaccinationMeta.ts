export type VaccinationDueStatus = "overdue" | "due-soon" | "upcoming" | "none";

export function getDueStatus(nextDueDate: string | null): VaccinationDueStatus {
  if (!nextDueDate) return "none";
  const today = new Date(new Date().toDateString());
  const due = new Date(nextDueDate);
  const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "overdue";
  if (diffDays <= 30) return "due-soon";
  return "upcoming";
}

export const dueStatusStyles: Record<VaccinationDueStatus, string> = {
  overdue: "bg-destructive/10 text-destructive",
  "due-soon": "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  upcoming: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  none: "bg-muted text-muted-foreground",
};

export const dueStatusLabels: Record<VaccinationDueStatus, string> = {
  overdue: "Overdue",
  "due-soon": "Due Soon",
  upcoming: "Up to Date",
  none: "No Reminder",
};

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
