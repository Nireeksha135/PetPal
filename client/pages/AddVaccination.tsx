import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, PawPrint } from "lucide-react";
import VaccinationForm from "@/components/vaccinations/VaccinationForm";
import { usePets } from "@/hooks/usePets";
import { useSaveVaccination } from "@/hooks/useSaveVaccination";
import { getApiErrorMessage } from "@/services/api";
import type { VaccinationFormPayload } from "@/types/vaccination";
import EmptyState from "@/components/EmptyState";
import Button from "@/components/Button";

export default function AddVaccination() {
  const { data: pets, isLoading } = usePets();
  const [searchParams] = useSearchParams();
  const preselectedPetId = searchParams.get("petId") ?? undefined;
  const { mutate, isPending } = useSaveVaccination();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const handleSubmit = (values: VaccinationFormPayload) => {
    setServerError(null);
    mutate(values, {
      onSuccess: (vaccination) =>
        navigate(`/vaccinations/${vaccination.id}`, { replace: true }),
      onError: (error) => setServerError(getApiErrorMessage(error)),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/vaccinations"
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Back to Vaccination Tracker
      </Link>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add Vaccination</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Record a completed vaccination or booster.
        </p>
      </div>

      {!isLoading && (!pets || pets.length === 0) ? (
        <EmptyState
          icon={PawPrint}
          title="Add a pet first"
          description="You'll need at least one pet profile before adding a vaccination."
          action={
            <Link to="/pets/new">
              <Button size="sm">Add a Pet</Button>
            </Link>
          }
        />
      ) : (
        pets && (
          <VaccinationForm
            pets={pets}
            defaultValues={
              preselectedPetId ? { petId: preselectedPetId } : undefined
            }
            onSubmit={handleSubmit}
            isSubmitting={isPending}
            serverError={serverError}
            submitLabel="Add Vaccination"
          />
        )
      )}
    </div>
  );
}
