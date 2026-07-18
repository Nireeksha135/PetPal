import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import FleaTickForm from "@/components/fleaTick/FleaTickForm";
import { useFleaTickTreatment } from "@/hooks/useFleaTick";
import { usePets } from "@/hooks/usePets";
import { useSaveFleaTick } from "@/hooks/useSaveFleaTick";
import { getApiErrorMessage } from "@/services/api";
import Skeleton from "@/components/Skeleton";
import ErrorState from "@/components/ErrorState";
import type { FleaTickFormPayload } from "@/types/fleaTick";
import type { FleaTickFormValues } from "@/utils/validation/fleaTickSchemas";

export default function EditFleaTick() {
  const { treatmentId } = useParams<{ treatmentId: string }>();
  const {
    data: treatment,
    isLoading,
    isError,
    refetch,
  } = useFleaTickTreatment(treatmentId);
  const { data: pets } = usePets();
  const { mutate, isPending } = useSaveFleaTick({ treatmentId });
  const [serverError, setServerError] = useState<string | null>(null);
  const [defaultValues, setDefaultValues] = useState
    Partial<FleaTickFormValues> | undefined
  >(undefined);

  useEffect(() => {
    if (treatment) {
      setDefaultValues({
        petId: treatment.petId,
        productName: treatment.productName,
        treatmentType: treatment.treatmentType,
        dateApplied: treatment.dateApplied,
        nextDueDate: treatment.nextDueDate ?? "",
        administeredBy: treatment.administeredBy ?? "",
        notes: treatment.notes ?? "",
        reminderEnabled: treatment.reminderEnabled,
      });
    }
  }, [treatment]);

  const handleSubmit = (values: FleaTickFormPayload) => {
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

  if (isError || !treatment) {
    return <ErrorState title="Treatment not found" onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        to={`/flea-tick/${treatment.id}`}
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Back to {treatment.productName}
      </Link>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Edit {treatment.productName}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update treatment record details.
        </p>
      </div>

      <FleaTickForm
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
