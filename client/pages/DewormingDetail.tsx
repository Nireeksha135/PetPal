import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2, ShieldPlus } from "lucide-react";
import { Calendar, Pill, User as UserIcon, Bell } from "lucide-react";
import { useDewormingRecord } from "@/hooks/useDeworming";
import { useDeleteDeworming } from "@/hooks/useSaveDeworming";
import { usePet } from "@/hooks/usePet";
import Skeleton from "@/components/Skeleton";
import ErrorState from "@/components/ErrorState";
import Button from "@/components/Button";
import DeletePetDialog from "@/components/pets/DeletePetDialog";
import PetInfoRow from "@/components/pets/PetInfoRow";
import {
  getDueStatus,
  dueStatusStyles,
  dueStatusLabels,
  formatDate,
} from "@/utils/vaccinationMeta";
import { cn } from "@/utils/cn";

export default function DewormingDetail() {
  const { recordId } = useParams<{ recordId: string }>();
  const navigate = useNavigate();
  const { data: record, isLoading, isError, refetch } = useDewormingRecord(recordId);
  const { data: pet } = usePet(record?.petId);
  const deleteMutation = useDeleteDeworming();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-56 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !record) {
    return <ErrorState title="Record not found" onRetry={() => refetch()} />;
  }

  const status = getDueStatus(record.nextDueDate);

  const handleDelete = () => {
    deleteMutation.mutate(
      { recordId: record.id, petId: record.petId },
      { onSuccess: () => navigate("/deworming", { replace: true }) },
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/deworming"
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Back to Deworming Tracker
      </Link>

      <div className="rounded-2xl bg-card p-8 shadow-card">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ShieldPlus size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {record.productName}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {pet ? `for ${pet.name}` : ""}
              </p>
              <span
                className={cn(
                  "mt-2 inline-block rounded-full px-2.5 py-1 text-xs font-medium",
                  dueStatusStyles[status],
                )}
              >
                {dueStatusLabels[status]}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <Link to={`/deworming/${record.id}/edit`}>
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
        <h2 className="mb-1 text-base font-semibold">Details</h2>
        <div className="divide-y divide-border">
          <PetInfoRow
            icon={Calendar}
            label="Date Given"
            value={formatDate(record.dateGiven)}
          />
          <PetInfoRow
            icon={Calendar}
            label="Next Due Date"
            value={formatDate(record.nextDueDate)}
          />
          <PetInfoRow
            icon={Pill}
            label="Dosage"
            value={record.dosage ?? "Not recorded"}
          />
          <PetInfoRow
            icon={UserIcon}
            label="Administered By"
            value={record.administeredBy ?? "Not recorded"}
          />
          <PetInfoRow
            icon={Bell}
            label="Reminder"
            value={record.reminderEnabled ? "Enabled" : "Disabled"}
          />
        </div>
      </div>

      {record.notes && (
        <div className="rounded-2xl bg-card p-6 shadow-card">
          <h2 className="mb-2 text-base font-semibold">Notes</h2>
          <p className="text-sm text-muted-foreground">{record.notes}</p>
        </div>
      )}

      <DeletePetDialog
        open={deleteDialogOpen}
        petName={record.productName}
        isDeleting={deleteMutation.isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
}
