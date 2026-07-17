import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2, Plus, ClipboardList } from "lucide-react";
import { useMedicine } from "@/hooks/useMedicines";
import { useMedicineLogs } from "@/hooks/useMedicineLogs";
import { useDeleteMedicine } from "@/hooks/useSaveMedicine";
import { useMedicineLogActions } from "@/hooks/useMedicineLogActions";
import { usePet } from "@/hooks/usePet";
import Skeleton from "@/components/Skeleton";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import Button from "@/components/Button";
import DeletePetDialog from "@/components/pets/DeletePetDialog";
import LogDoseDialog from "@/components/medicine/LogDoseDialog";
import DoseLogRow from "@/components/medicine/DoseLogRow";
import { frequencyLabels, formatDateTime } from "@/utils/medicineMeta";

export default function MedicineDetail() {
  const { medicineId } = useParams<{ medicineId: string }>();
  const navigate = useNavigate();
  const { data: medicine, isLoading, isError, refetch } = useMedicine(medicineId);
  const { data: pet } = usePet(medicine?.petId);
  const { data: logs, isLoading: logsLoading } = useMedicineLogs(medicineId);
  const deleteMutation = useDeleteMedicine();
  const logActions = useMedicineLogActions(medicineId ?? "");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [logDialogOpen, setLogDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !medicine) {
    return <ErrorState title="Medicine not found" onRetry={() => refetch()} />;
  }

  const handleDelete = () => {
    deleteMutation.mutate(
      { medicineId: medicine.id, petId: medicine.petId },
      { onSuccess: () => navigate("/medicine", { replace: true }) },
    );
  };

  const isLogBusy =
    logActions.markGiven.isPending ||
    logActions.markMissed.isPending ||
    logActions.deleteLog.isPending;

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/medicine"
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Back to Medicine Tracker
      </Link>

      <div className="rounded-2xl bg-card p-8 shadow-card">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {medicine.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {medicine.dosage} · {frequencyLabels[medicine.frequency]}
              {pet ? ` · for ${pet.name}` : ""}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {formatDateTime(medicine.startDate)}
              {medicine.endDate ? ` – ${formatDateTime(medicine.endDate)}` : " – ongoing"}
            </p>
            {medicine.instructions && (
              <p className="mt-3 max-w-lg text-sm text-foreground">
                {medicine.instructions}
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <Link to={`/medicine/${medicine.id}/edit`}>
              <Button variant="secondary">
                <Pencil size={16} />
                Edit
              </Button>
            </Link>
            <Button
              variant="destructive"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 size={16} />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-card p-6 shadow-card">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Dose Log</h2>
          <Button size="sm" onClick={() => setLogDialogOpen(true)}>
            <Plus size={14} />
            Log Dose
          </Button>
        </div>

        <div className="mt-4">
          {logsLoading ? (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : !logs || logs.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title="No doses logged yet"
              description="Log a dose to start tracking when this medicine is given."
            />
          ) : (
            <div className="flex flex-col gap-2">
              {logs.map((log) => (
                <DoseLogRow
                  key={log.id}
                  log={log}
                  isBusy={isLogBusy}
                  onMarkGiven={() =>
                    logActions.markGiven.mutate({ logId: log.id })
                  }
                  onMarkMissed={() => logActions.markMissed.mutate(log.id)}
                  onDelete={() => logActions.deleteLog.mutate(log.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <DeletePetDialog
        open={deleteDialogOpen}
        petName={medicine.name}
        isDeleting={deleteMutation.isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />

      <LogDoseDialog
        open={logDialogOpen}
        isSubmitting={logActions.createLog.isPending}
        onConfirm={(scheduledFor) =>
          logActions.createLog.mutate(
            { scheduledFor },
            { onSuccess: () => setLogDialogOpen(false) },
          )
        }
        onCancel={() => setLogDialogOpen(false)}
      />
    </div>
  );
}
