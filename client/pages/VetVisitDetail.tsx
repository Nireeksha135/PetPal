import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2, Stethoscope } from "lucide-react";
import {
  Calendar,
  Building2,
  User as UserIcon,
  DollarSign,
  ClipboardCheck,
} from "lucide-react";
import { useVetVisit } from "@/hooks/useVetVisits";
import { useDeleteVetVisit } from "@/hooks/useSaveVetVisit";
import { usePet } from "@/hooks/usePet";
import Skeleton from "@/components/Skeleton";
import ErrorState from "@/components/ErrorState";
import Button from "@/components/Button";
import DeletePetDialog from "@/components/pets/DeletePetDialog";
import PetInfoRow from "@/components/pets/PetInfoRow";
import {
  visitTypeLabels,
  visitTypeStyles,
  formatDate,
  formatCost,
} from "@/utils/vetVisitMeta";
import { cn } from "@/utils/cn";

export default function VetVisitDetail() {
  const { visitId } = useParams<{ visitId: string }>();
  const navigate = useNavigate();
  const { data: visit, isLoading, isError, refetch } = useVetVisit(visitId);
  const { data: pet } = usePet(visit?.petId);
  const deleteMutation = useDeleteVetVisit();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-56 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !visit) {
    return <ErrorState title="Visit not found" onRetry={() => refetch()} />;
  }

  const handleDelete = () => {
    deleteMutation.mutate(
      { visitId: visit.id, petId: visit.petId },
      { onSuccess: () => navigate("/vet-visits", { replace: true }) },
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/vet-visits"
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Back to Vet Visit Manager
      </Link>

      <div className="rounded-2xl bg-card p-8 shadow-card">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Stethoscope size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {visit.reason}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {pet ? `for ${pet.name}` : ""} · {formatDate(visit.visitDate)}
              </p>
              <span
                className={cn(
                  "mt-2 inline-block rounded-full px-2.5 py-1 text-xs font-medium",
                  visitTypeStyles[visit.visitType],
                )}
              >
                {visitTypeLabels[visit.visitType]}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <Link to={`/vet-visits/${visit.id}/edit`}>
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
        <h2 className="mb-1 text-base font-semibold">Visit Details</h2>
        <div className="divide-y divide-border">
          <PetInfoRow
            icon={UserIcon}
            label="Vet"
            value={visit.vetName ?? "Not recorded"}
          />
          <PetInfoRow
            icon={Building2}
            label="Clinic"
            value={visit.clinicName ?? "Not recorded"}
          />
          <PetInfoRow
            icon={DollarSign}
            label="Cost"
            value={formatCost(visit.cost)}
          />
          <PetInfoRow
            icon={ClipboardCheck}
            label="Follow-up Needed"
            value={visit.followUpNeeded ? "Yes" : "No"}
          />
          {visit.followUpNeeded && (
            <PetInfoRow
              icon={Calendar}
              label="Follow-up Date"
              value={formatDate(visit.followUpDate)}
            />
          )}
        </div>
      </div>

      {(visit.diagnosis || visit.treatment) && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {visit.diagnosis && (
            <div className="rounded-2xl bg-card p-6 shadow-card">
              <h2 className="mb-2 text-base font-semibold">Diagnosis</h2>
              <p className="text-sm text-muted-foreground">
                {visit.diagnosis}
              </p>
            </div>
          )}
          {visit.treatment && (
            <div className="rounded-2xl bg-card p-6 shadow-card">
              <h2 className="mb-2 text-base font-semibold">Treatment</h2>
              <p className="text-sm text-muted-foreground">
                {visit.treatment}
              </p>
            </div>
          )}
        </div>
      )}

      {visit.notes && (
        <div className="rounded-2xl bg-card p-6 shadow-card">
          <h2 className="mb-2 text-base font-semibold">Notes</h2>
          <p className="text-sm text-muted-foreground">{visit.notes}</p>
        </div>
      )}

      <DeletePetDialog
        open={deleteDialogOpen}
        petName={visit.reason}
        isDeleting={deleteMutation.isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
}
