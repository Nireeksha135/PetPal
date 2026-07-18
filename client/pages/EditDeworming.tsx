import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import DewormingForm from "@/components/deworming/DewormingForm";
import { useDewormingRecord } from "@/hooks/useDeworming";
import { usePets } from "@/hooks/usePets";
import { useSaveDeworming } from "@/hooks/useSaveDeworming";
import { getApiErrorMessage } from "@/services/api";
import Skeleton from "@/components/Skeleton";
import ErrorState from "@/components/ErrorState";
import type { DewormingFormPayload } from "@/types/deworming";
import type { DewormingFormValues } from "@/utils/validation/dewormingSchemas";

export default function EditDeworming() {
  const { recordId } = useParams<{ recordId: string }>();
  const { data: record, isLoading, isError, refetch } = useDewormingRecord(recordId);
  const { data: pets } = usePets();
  const { mutate, isPending } = useSaveDeworming({ recordId });
  const [serverError, setServerError] = useState<string | null>(null);
  const [defaultValues, setDefaultValues] = useState
    Partial<DewormingFormValues> | undefined
  >(undefined);

  useEffect(() => {
    if (record) {
      setDefaultValues({
        petId: record.petId,
        productName: record.productName,
        dateGiven: record.dateGiven,
        nextDueDate: record.nextDueDate ?? "",
        dosage: record.dosage ?? "",
        administeredBy: record.administeredBy ?? "",
        notes: record.notes ?? "",
        reminderEnabled: record.reminderEnabled,
      });
    }
  }, [record]);

  const handleSubmit = (values: DewormingFormPayload) => {
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

  if (isError || !record) {
    return <ErrorState title="Record not found" onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        to={`/deworming/${record.id}`}
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Back to {record.productName}
      </Link>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Edit {record.productName}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update deworming record details.
        </p>
      </div>

      <DewormingForm
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
