import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PetForm from "@/components/pets/PetForm";
import AvatarUploader from "@/components/pets/AvatarUploader";
import { usePet } from "@/hooks/usePet";
import { useSavePet } from "@/hooks/useSavePet";
import { useAvatarUpload } from "@/hooks/useAvatarUpload";
import { getApiErrorMessage } from "@/services/api";
import Skeleton from "@/components/Skeleton";
import ErrorState from "@/components/ErrorState";
import type { PetFormPayload } from "@/types/pet";
import type { PetFormValues } from "@/utils/validation/petSchemas";

export default function EditPet() {
  const { petId } = useParams<{ petId: string }>();
  const { data: pet, isLoading, isError, refetch } = usePet(petId);
  const { mutate, isPending } = useSavePet({ petId });
  const uploadAvatar = useAvatarUpload(petId);
  const [serverError, setServerError] = useState<string | null>(null);
  const [defaultValues, setDefaultValues] = useState
    Partial<PetFormValues> | undefined
  >(undefined);

  useEffect(() => {
    if (pet) {
      setDefaultValues({
        name: pet.name,
        species: pet.species,
        breed: pet.breed ?? "",
        gender: pet.gender,
        dateOfBirth: pet.dateOfBirth ?? "",
        weightKg: pet.weightKg ?? undefined,
        color: pet.color ?? "",
        microchipId: pet.microchipId ?? "",
        isNeutered: pet.isNeutered,
        notes: pet.notes ?? "",
      });
    }
  }, [pet]);

  const handleSubmit = (values: PetFormPayload) => {
    setServerError(null);
    mutate(values, {
      onError: (error) => setServerError(getApiErrorMessage(error)),
    });
  };

  if (isLoading || !defaultValues) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !pet) {
    return <ErrorState title="Pet not found" onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        to={`/pets/${pet.id}`}
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Back to {pet.name}'s Profile
      </Link>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit {pet.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update your pet's profile details.
        </p>
      </div>

      <div className="flex justify-center rounded-2xl bg-card p-6 shadow-card">
        <AvatarUploader
          name={pet.name}
          species={pet.species}
          avatarUrl={pet.avatarUrl}
          onUpload={(file) => uploadAvatar.mutateAsync(file)}
        />
      </div>

      <PetForm
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        isSubmitting={isPending}
        serverError={serverError}
        submitLabel="Save Changes"
      />
    </div>
  );
}
