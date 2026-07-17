import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import MedicineForm from "@/components/medicine/MedicineForm";
import { useMedicine } from "@/hooks/useMedicines";
import { usePets } from "@/hooks/usePets";
import { useSaveMedicine } from "@/hooks/useSaveMedicine";
import { getApiErrorMessage } from "@/services/api";
import Skeleton from "@/components/Skeleton";
import ErrorState from "@/components/ErrorState";
import type { MedicineFormPayload } from "@/types/medicine";
import type { MedicineFormValues } from "@/utils/validation/medicineSchemas";

export default function EditMedicine() {
  const { medicineId } = useParams<{ medicineId: string }>();
  const { data: medicine, isLoading, isError, refetch } = useMedicine(medicineId);
  const { data: pets } = usePets();
  const { mutate, isPending } = useSaveMedicine({ medicineId });
  const [serverError, setServerError] = useState<string | null>(null);
  const [defaultValues, setDefaultValues] = useState
    Partial<MedicineFormValues> | undefined
  >(undefined);

  useEffect(() => {
    if (medicine) {
      setDefaultValues({
        petId: medicine.petId,
        name: medicine.name,
        dosage: medicine.dosage,
        frequency: medicine.frequency,
        timesPerDay: medicine.timesPerDay,
        startDate: medicine.startDate,
        endDate: medicine.endDate ?? "",
        instructions: medicine.instructions ?? "",
        prescribedBy: medicine.prescribedBy ?? "",
        isActive: medicine.isActive,
      });
    }
  }, [medicine]);

  const handleSubmit = (values: MedicineFormPayload) => {
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

  if (isError || !medicine) {
    return <ErrorState title="Medicine not found" onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        to={`/medicine/${medicine.id}`}
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Back to {medicine.name}
      </Link>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Edit {medicine.name}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update prescription details.
        </p>
      </div>

      <MedicineForm
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
