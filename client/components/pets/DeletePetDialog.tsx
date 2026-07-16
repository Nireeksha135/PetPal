import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import Button from "@/components/Button";

interface DeletePetDialogProps {
  open: boolean;
  petName: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeletePetDialog({
  open,
  petName,
  isDeleting,
  onConfirm,
  onCancel,
}: DeletePetDialogProps) {
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
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <AlertTriangle size={20} />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Remove {petName}?</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              This will permanently delete {petName}'s profile and all
              associated records. This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={onCancel} disabled={isDeleting}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={onConfirm}
                isLoading={isDeleting}
              >
                Delete Pet
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
