import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import MedicineForm from "@/components/medicine/MedicineForm";
import { usePets } from "@/hooks/usePets";
import { useSaveMedicine } from "@/hooks/useSaveMedicine";
import { useNavigate } from "react-router-dom";
import { getApiErrorMessage } from "@/services/api";
import type { MedicineFormPayload } from "@/types/medicine";
import EmptyState from "@/components/EmptyState";
import Button from "@/components/Button";
import { PawPrint } from "lucide-react";

export default function AddMedicine() {
  const { data: pets, isLoading } = usePets();
  const [searchParams] = useSearchParams();
  const preselectedPetId = searchParams.get("petId") ?? undefined;
  const { mutate, isPending } = useSaveMedicine();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const handleSubmit = (values: MedicineFormPayload) => {
    setServerError(null);
    mutate(values, {
      onSuccess: (medicine) => navigate(`/medicine/${medicine.id}`, { replace: true }),
      onError: (error) => setServerError(getApiErrorMessage(error)),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/medicine"
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Back to Medicine Tracker
      </Link>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add Medicine</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Record a new prescription or medication.
        </p>
      </div>

      {!isLoading && (!pets || pets.length === 0) ? (
        <EmptyState
          icon={PawPrint}
          title="Add a pet first"
          description="You'll need at least one pet profile before adding a medicine."
          action={
            <Link to="/pets/new">
              <Button size="sm">Add a Pet</Button>
            </Link>
          }
        />
      ) : (
        pets && (
          <MedicineForm
            pets={pets}
            defaultValues={
              preselectedPetId ? { petId: preselectedPetId } : undefined
            }
            onSubmit={handleSubmit}
            isSubmitting={isPending}
            serverError={serverError}
            submitLabel="Add Medicine"
          />
        )
      )}
    </div>
  );
}
