import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pill } from "lucide-react";
import Button from "@/components/Button";
import FormField from "@/components/FormField";

interface LogDoseDialogProps {
  open: boolean;
  isSubmitting: boolean;
  onConfirm: (scheduledFor: string) => void;
  onCancel: () => void;
}

function nowLocalDatetime(): string {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}

export default function LogDoseDialog({
  open,
  isSubmitting,
  onConfirm,
  onCancel,
}: LogDoseDialogProps) {
  const [scheduledFor, setScheduledFor] = useState(nowLocalDatetime());

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 w-full max-w-sm rounded-2xl bg-card p-6 shadow-elevated"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Pill size={20} />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Log a Dose</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Record when this dose was or will be given.
            </p>

            <div className="mt-4">
              <FormField
                label="Scheduled For"
                type="datetime-local"
                value={scheduledFor}
                onChange={(e) => setScheduledFor(e.target.value)}
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                onClick={() => onConfirm(new Date(scheduledFor).toISOString())}
                isLoading={isSubmitting}
              >
                Log Dose
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
