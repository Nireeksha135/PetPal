import type { ActivityLevel, BodyCondition } from "@/types/dietPlan";

export const activityLevelOptions = [
  { value: "low", label: "Low (mostly indoors, short walks)" },
  { value: "moderate", label: "Moderate (daily walks/play)" },
  { value: "high", label: "High (very active, working/sporting)" },
] as const;

export const bodyConditionOptions = [
  { value: "underweight", label: "Underweight" },
  { value: "ideal", label: "Ideal" },
  { value: "overweight", label: "Overweight" },
  { value: "unknown", label: "Not sure" },
] as const;

export const activityLevelLabels: Record<ActivityLevel, string> = {
  low: "Low Activity",
  moderate: "Moderate Activity",
  high: "High Activity",
};

export const bodyConditionLabels: Record<BodyCondition, string> = {
  underweight: "Underweight",
  ideal: "Ideal Weight",
  overweight: "Overweight",
  unknown: "Unknown",
};

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
