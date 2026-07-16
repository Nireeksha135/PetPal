import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Calendar,
  Scale,
  Palette,
  Fingerprint,
  VenusAndMars,
  ShieldCheck,
  ShieldX,
  StickyNote,
} from "lucide-react";
import { usePet } from "@/hooks/usePet";
import { useDeletePet } from "@/hooks/useDeletePet";
import PetAvatar from "@/components/pets/PetAvatar";
import PetInfoRow from "@/components/pets/PetInfoRow";
import DeletePetDialog from "@/components/pets/DeletePetDialog";
import Skeleton from "@/components/Skeleton";
import ErrorState from "@/components/ErrorState";
import Button from "@/components/Button";
import { getSpeciesLabel, calculateAge, formatDate } from "@/utils/petMeta";

export default function PetProfile() {
  const { petId } = useParams<{ petId: string }>();
  const navigate = useNavigate();
  const { data: pet, isLoading, isError, refetch } = usePet(petId);
  const deleteMutation = useDeletePet();
  const [dialogOpen, setDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-9 w-40" />
        <div className="rounded-2xl bg-card p-8 shadow-card">
          <div className="flex items-center gap-5">
            <Skeleton className="h-28 w-28 rounded-2xl" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-7 w-40" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !pet) {
    return <ErrorState title="Pet not found" onRetry={() => refetch()} />;
  }

  const handleDelete = () => {
    deleteMutation.mutate(pet.id, {
      onSuccess: () => navigate("/pets", { replace: true }),
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

      <div className="rounded-2xl bg-card p-8 shadow-card">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-5">
            <PetAvatar
              name={pet.name}
              species={pet.species}
              avatarUrl={pet.avatarUrl}
              size="xl"
            />
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {pet.name}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {getSpeciesLabel(pet.species)}
                {pet.breed ? ` · ${pet.breed}` : ""}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {calculateAge(pet.dateOfBirth)}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link to={`/pets/${pet.id}/edit`}>
              <Button variant="secondary">
                <Pencil size={16} />
                Edit
              </Button>
            </Link>
            <Button variant="destructive" onClick={() => setDialogOpen(true)}>
              <Trash2 size={16} />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-card p-6 shadow-card">
          <h2 className="mb-1 text-base font-semibold">Details</h2>
          <div className="divide-y divide-border">
            <PetInfoRow
              icon={Calendar}
              label="Date of Birth"
              value={formatDate(pet.dateOfBirth)}
            />
            <PetInfoRow
              icon={VenusAndMars}
              label="Gender"
              value={
                pet.gender.charAt(0).toUpperCase() + pet.gender.slice(1)
              }
            />
            <PetInfoRow
              icon={Scale}
              label="Weight"
              value={pet.weightKg ? `${pet.weightKg} kg` : "Not recorded"}
            />
            <PetInfoRow
              icon={Palette}
              label="Color"
              value={pet.color ?? "Not recorded"}
            />
            <PetInfoRow
              icon={Fingerprint}
              label="Microchip ID"
              value={pet.microchipId ?? "Not recorded"}
            />
            <PetInfoRow
              icon={pet.isNeutered ? ShieldCheck : ShieldX}
              label="Neutered / Spayed"
              value={pet.isNeutered ? "Yes" : "No"}
            />
          </div>
        </div>

        <div className="rounded-2xl bg-card p-6 shadow-card">
          <div className="mb-3 flex items-center gap-2">
            <StickyNote size={17} className="text-muted-foreground" />
            <h2 className="text-base font-semibold">Notes</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            {pet.notes || "No notes added yet."}
          </p>
        </div>
      </div>

      <DeletePetDialog
        open={dialogOpen}
        petName={pet.name}
        isDeleting={deleteMutation.isPending}
        onConfirm={handleDelete}
        onCancel={() => setDialogOpen(false)}
      />
    </div>
  );
}
