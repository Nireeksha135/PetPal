import type { VisitType } from "@/types/vetVisit";

export const visitTypeLabels: Record<VisitType, string> = {
  checkup: "Checkup",
  sick_visit: "Sick Visit",
  surgery: "Surgery",
  emergency: "Emergency",
  dental: "Dental",
  grooming: "Grooming",
  follow_up: "Follow-up",
  other: "Other",
};

export const visitTypeStyles: Record<VisitType, string> = {
  checkup: "bg-primary/10 text-primary",
  sick_visit: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  surgery: "bg-destructive/10 text-destructive",
  emergency: "bg-destructive/10 text-destructive",
  dental: "bg-accent text-accent-foreground",
  grooming: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  follow_up: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  other: "bg-muted text-muted-foreground",
};

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatCost(cost: number | null): string {
  if (cost === null || cost === undefined) return "Not recorded";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(cost);
}

export function isUpcomingVisit(visitDate: string): boolean {
  return new Date(visitDate) > new Date(new Date().toDateString());
}
