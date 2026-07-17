import { CheckCircle2, XCircle, Clock, Trash2 } from "lucide-react";
import type { MedicineLog } from "@/types/medicine";
import { statusStyles, formatDateTime } from "@/utils/medicineMeta";
import { cn } from "@/utils/cn";

interface DoseLogRowProps {
  log: MedicineLog;
  onMarkGiven: () => void;
  onMarkMissed: () => void;
  onDelete: () => void;
  isBusy: boolean;
}

export default function DoseLogRow({
  log,
  onMarkGiven,
  onMarkMissed,
  onDelete,
  isBusy,
}: DoseLogRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-3">
      <div className="flex flex-col">
        <span className="text-sm font-medium">
          {formatDateTime(log.scheduledFor)}
        </span>
        {log.givenAt && (
          <span className="text-xs text-muted-foreground">
            Given at {formatDateTime(log.givenAt)}
          </span>
        )}
        {log.notes && (
          <span className="text-xs text-muted-foreground">{log.notes}</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-medium capitalize",
            statusStyles[log.status],
          )}
        >
          {log.status}
        </span>

        {log.status === "pending" && (
          <>
            <button
              type="button"
              disabled={isBusy}
              onClick={onMarkGiven}
              aria-label="Mark as given"
              title="Mark as given"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-emerald-600 hover:bg-emerald-500/10 disabled:opacity-50 dark:text-emerald-400"
            >
              <CheckCircle2 size={16} />
            </button>
            <button
              type="button"
              disabled={isBusy}
              onClick={onMarkMissed}
              aria-label="Mark as missed"
              title="Mark as missed"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-destructive hover:bg-destructive/10 disabled:opacity-50"
            >
              <XCircle size={16} />
            </button>
          </>
        )}
        <button
          type="button"
          disabled={isBusy}
          onClick={onDelete}
          aria-label="Delete log"
          title="Delete log"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
