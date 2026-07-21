import { AlertTriangle } from "lucide-react";

export default function DietDisclaimerBanner() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3">
      <AlertTriangle
        size={18}
        className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400"
      />
      <p className="text-xs text-amber-700 dark:text-amber-300">
        This diet guidance is general information only. Confirm portions and
        any specific dietary changes with your veterinarian, especially for
        pets with existing health conditions.
      </p>
    </div>
  );
}
