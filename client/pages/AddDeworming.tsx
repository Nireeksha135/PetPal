import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, PawPrint } from "lucide-react";
import DewormingForm from "@/components/deworming/DewormingForm";
import { usePets } from "@/hooks/usePets";
import { useSaveDeworming } from "@/hooks/useSaveDeworming";
import { getApiErrorMessage } from "@/services/api";
import type { DewormingFormPayload } from "@/types/deworming";
import EmptyState from "@/components/EmptyState";
import Button from "@/components/Button";

export default function AddDeworming() {
  const { data: pets, isLoading } = usePets();
  const [searchParams] = useSearchParams();
  const preselectedPetId = searchParams.get("petId") ?? undefined;
  const { mutate, isPending } = useSaveDeworming();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const handleSubmit = (values: DewormingFormPayload) => {
    setServerError(null);
    mutate(values, {
      onSuccess: (record) => navigate(`/deworming/${record.id}`, { replace: true }),
      onError: (error) => setServerError(getApiErrorMessage(error)),
    });
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

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add Deworming Record</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Record a completed deworming treatment.
        </p>
      </div>

      {!isLoading && (!pets || pets.length === 0) ? (
        <EmptyState
          icon={PawPrint}
          title="Add a pet first"
          description="You'll need at least one pet profile before adding a deworming record."
          action={
            <Link to="/pets/new">
              <Button size="sm">Add a Pet</Button>
            </Link>
          }
        />
      ) : (
        pets && (
          <DewormingForm
            pets={pets}
            defaultValues={
              preselectedPetId ? { petId: preselectedPetId } : undefined
            }
            onSubmit={handleSubmit}
            isSubmitting={isPending}
            serverError={serverError}
            submitLabel="Add Record"
          />
        )
      )}
    </div>
  );
}
