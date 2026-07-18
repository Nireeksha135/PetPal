import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, PawPrint } from "lucide-react";
import VetVisitForm from "@/components/vetVisits/VetVisitForm";
import { usePets } from "@/hooks/usePets";
import { useSaveVetVisit } from "@/hooks/useSaveVetVisit";
import { getApiErrorMessage } from "@/services/api";
import type { VetVisitFormPayload } from "@/types/vetVisit";
import EmptyState from "@/components/EmptyState";
import Button from "@/components/Button";

export default function AddVetVisit() {
  const { data: pets, isLoading } = usePets();
  const [searchParams] = useSearchParams();
  const preselectedPetId = searchParams.get("petId") ?? undefined;
  const { mutate, isPending } = useSaveVetVisit();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const handleSubmit = (values: VetVisitFormPayload) => {
    setServerError(null);
    mutate(values, {
      onSuccess: (visit) => navigate(`/vet-visits/${visit.id}`, { replace: true }),
      onError: (error) => setServerError(getApiErrorMessage(error)),
    });
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

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add Vet Visit</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Record a checkup, procedure, or emergency visit.
        </p>
      </div>

      {!isLoading && (!pets || pets.length === 0) ? (
        <EmptyState
          icon={PawPrint}
          title="Add a pet first"
          description="You'll need at least one pet profile before adding a vet visit."
          action={
            <Link to="/pets/new">
              <Button size="sm">Add a Pet</Button>
            </Link>
          }
        />
      ) : (
        pets && (
          <VetVisitForm
            pets={pets}
            defaultValues={
              preselectedPetId ? { petId: preselectedPetId } : undefined
            }
            onSubmit={handleSubmit}
            isSubmitting={isPending}
            serverError={serverError}
            submitLabel="Add Visit"
          />
        )
      )}
    </div>
  );
}
