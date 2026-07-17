import type { MedicineFrequency, MedicineLogStatus } from "@/types/medicine";

export const frequencyLabels: Record<MedicineFrequency, string> = {
  once_daily: "Once Daily",
  twice_daily: "Twice Daily",
  three_times_daily: "Three Times Daily",
  weekly: "Weekly",
  as_needed: "As Needed",
  custom: "Custom",
};

export const statusStyles: Record<MedicineLogStatus, string> = {
  pending: "bg-primary/10 text-primary",
  given: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  missed: "bg-destructive/10 text-destructive",
};

export function formatDateTime(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function isMedicineExpired(endDate: string | null): boolean {
  if (!endDate) return false;
  return new Date(endDate) < new Date(new Date().toDateString());
}
