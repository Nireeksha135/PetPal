import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PetForm from "@/components/pets/PetForm";
import { useSavePet } from "@/hooks/useSavePet";
import { getApiErrorMessage } from "@/services/api";
import { useState } from "react";
import type { PetFormPayload } from "@/types/pet";

export default function AddPet() {
  const { mutate, isPending } = useSavePet();
  const [serverError, setServerError] = useState<string | null>(null);

  const handleSubmit = (values: PetFormPayload) => {
    setServerError(null);
    mutate(values, {
      onError: (error) => setServerError(getApiErrorMessage(error)),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/pets"
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Back to My Pets
      </Link>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add a Pet</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tell us about your new companion.
        </p>
      </div>

      <PetForm
        onSubmit={handleSubmit}
        isSubmitting={isPending}
        serverError={serverError}
        submitLabel="Add Pet"
      />
    </div>
  );
}
