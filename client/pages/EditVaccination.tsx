import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import VaccinationForm from "@/components/vaccinations/VaccinationForm";
import { useVaccination } from "@/hooks/useVaccinations";
import { usePets } from "@/hooks/usePets";
import { useSaveVaccination } from "@/hooks/useSaveVaccination";
import { getApiErrorMessage } from "@/services/api";
import Skeleton from "@/components/Skeleton";
import ErrorState from "@/components/ErrorState";
import type { VaccinationFormPayload } from "@/types/vaccination";
import type { VaccinationFormValues } from "@/utils/validation/vaccinationSchemas";

export default function EditVaccination() {
  const { vaccinationId } = useParams<{ vaccinationId: string }>();
  const {
    data: vaccination,
    isLoading,
    isError,
    refetch,
  } = useVaccination(vaccinationId);
  const { data: pets } = usePets();
  const { mutate, isPending } = useSaveVaccination({ vaccinationId });
  const [serverError, setServerError] = useState<string | null>(null);
  const [defaultValues, setDefaultValues] = useState
    Partial<VaccinationFormValues> | undefined
  >(undefined);

  useEffect(() => {
    if (vaccination) {
      setDefaultValues({
        petId: vaccination.petId,
        vaccineName: vaccination.vaccineName,
        dateAdministered: vaccination.dateAdministered,
        nextDueDate: vaccination.nextDueDate ?? "",
        administeredBy: vaccination.administeredBy ?? "",
        clinicName: vaccination.clinicName ?? "",
        batchNumber: vaccination.batchNumber ?? "",
        notes: vaccination.notes ?? "",
        reminderEnabled: vaccination.reminderEnabled,
      });
    }
  }, [vaccination]);

  const handleSubmit = (values: VaccinationFormPayload) => {
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

  if (isError || !vaccination) {
    return (
      <ErrorState title="Vaccination not found" onRetry={() => refetch()} />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        to={`/vaccinations/${vaccination.id}`}
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Back to {vaccination.vaccineName}
      </Link>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Edit {vaccination.vaccineName}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update vaccination record details.
        </p>
      </div>

      <VaccinationForm
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
