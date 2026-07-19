import { AlertTriangle } from "lucide-react";

export default function AIDisclaimerBanner() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3">
      <AlertTriangle
        size={18}
        className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400"
      />
      <p className="text-xs text-amber-700 dark:text-amber-300">
        AI Pet Doctor gives general information only and is not a substitute
        for professional veterinary care. If your pet is in distress or you
        suspect an emergency, contact a vet immediately.
      </p>
    </div>
  );
}
