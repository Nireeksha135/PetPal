import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, PawPrint } from "lucide-react";
import FleaTickForm from "@/components/fleaTick/FleaTickForm";
import { usePets } from "@/hooks/usePets";
import { useSaveFleaTick } from "@/hooks/useSaveFleaTick";
import { getApiErrorMessage } from "@/services/api";
import type { FleaTickFormPayload } from "@/types/fleaTick";
import EmptyState from "@/components/EmptyState";
import Button from "@/components/Button";

export default function AddFleaTick() {
  const { data: pets, isLoading } = usePets();
  const [searchParams] = useSearchParams();
  const preselectedPetId = searchParams.get("petId") ?? undefined;
  const { mutate, isPending } = useSaveFleaTick();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const handleSubmit = (values: FleaTickFormPayload) => {
    setServerError(null);
    mutate(values, {
      onSuccess: (treatment) =>
        navigate(`/flea-tick/${treatment.id}`, { replace: true }),
      onError: (error) => setServerError(getApiErrorMessage(error)),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/flea-tick"
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Back to Flea & Tick Tracker
      </Link>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add Treatment</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Record a completed flea & tick treatment.
        </p>
      </div>

      {!isLoading && (!pets || pets.length === 0) ? (
        <EmptyState
          icon={PawPrint}
          title="Add a pet first"
          description="You'll need at least one pet profile before adding a treatment."
          action={
            <Link to="/pets/new">
              <Button size="sm">Add a Pet</Button>
            </Link>
          }
        />
      ) : (
        pets && (
          <FleaTickForm
            pets={pets}
            defaultValues={
              preselectedPetId ? { petId: preselectedPetId } : undefined
            }
            onSubmit={handleSubmit}
            isSubmitting={isPending}
            serverError={serverError}
            submitLabel="Add Treatment"
          />
        )
      )}
    </div>
  );
}
