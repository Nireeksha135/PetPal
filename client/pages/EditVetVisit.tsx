import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import VetVisitForm from "@/components/vetVisits/VetVisitForm";
import { useVetVisit } from "@/hooks/useVetVisits";
import { usePets } from "@/hooks/usePets";
import { useSaveVetVisit } from "@/hooks/useSaveVetVisit";
import { getApiErrorMessage } from "@/services/api";
import Skeleton from "@/components/Skeleton";
import ErrorState from "@/components/ErrorState";
import type { VetVisitFormPayload } from "@/types/vetVisit";
import type { VetVisitFormValues } from "@/utils/validation/vetVisitSchemas";

export default function EditVetVisit() {
  const { visitId } = useParams<{ visitId: string }>();
  const { data: visit, isLoading, isError, refetch } = useVetVisit(visitId);
  const { data: pets } = usePets();
  const { mutate, isPending } = useSaveVetVisit({ visitId });
  const [serverError, setServerError] = useState<string | null>(null);
  const [defaultValues, setDefaultValues] = useState
    Partial<VetVisitFormValues> | undefined
  >(undefined);

  useEffect(() => {
    if (visit) {
      setDefaultValues({
        petId: visit.petId,
        visitDate: visit.visitDate,
        visitType: visit.visitType,
        reason: visit.reason,
        vetName: visit.vetName ?? "",
        clinicName: visit.clinicName ?? "",
        diagnosis: visit.diagnosis ?? "",
        treatment: visit.treatment ?? "",
        cost: visit.cost ?? undefined,
        followUpDate: visit.followUpDate ?? "",
        followUpNeeded: visit.followUpNeeded,
        notes: visit.notes ?? "",
      });
    }
  }, [visit]);

  const handleSubmit = (values: VetVisitFormPayload) => {
    setServerError(null);
    mutate(values, {
      onError: (error) => setServerError(getApiErrorMessage(error)),
    });
  };

  if (isLoading || !defaultValues || !pets) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !visit) {
    return <ErrorState title="Visit not found" onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        to={`/vet-visits/${visit.id}`}
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Back to visit
      </Link>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Vet Visit</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update visit details.
        </p>
      </div>

      <VetVisitForm
        pets={pets}
        defaultValues={defaultValues}
        lockPet
        onSubmit={handleSubmit}
        isSubmitting={isPending}
        serverError={serverError}
        submitLabel="Save Changes"
      />
    </div>
  );
}
