import { useState } from "react";
import { useTransform, motion } from "framer-motion";
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
import { usePageParallax } from "@/hooks/usePageParallax";
import { useTilt } from "@/hooks/useTilt";
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
  const { x, y } = usePageParallax();
  const avatarTilt = useTilt(10);

  const frontX = useTransform(x, (v) => v * 14);
  const frontY = useTransform(y, (v) => v * 10);
  const midX = useTransform(x, (v) => v * 4);
  const midY = useTransform(y, (v) => v * 3);
  const backX = useTransform(x, (v) => v * -5);
  const backY = useTransform(y, (v) => v * -3);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-9 w-40" />
        <div className="bg-card rim-light rounded-3xl p-8">
          <div className="flex items-center gap-5">
            <Skeleton className="h-28 w-28 rounded-3xl" />
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
    <div className="relative flex flex-col gap-8 [perspective:1600px]">
      <Link
        to="/pets"
        className="relative z-30 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Back to My Pets
      </Link>

      {/* Midground — the header panel anchoring this room */}
      <motion.div style={{ x: midX, y: midY }} className="relative z-10">
        <div className="bg-card rim-light rounded-3xl p-8 pb-14">
          <div className="hidden sm:block" />
        </div>
      </motion.div>

      {/* Foreground — avatar + identity float above the header panel,
          tilting toward the cursor independently of page drift */}
      <motion.div
        style={{ x: frontX, y: frontY }}
        className="relative z-30 -mt-40 flex flex-col justify-between gap-6 px-2 sm:-mt-36 sm:flex-row sm:items-end sm:px-6"
      >
        <div className="flex items-end gap-5">
          <motion.div
            ref={avatarTilt.ref}
            onMouseMove={avatarTilt.handlers.onMouseMove}
            onMouseEnter={avatarTilt.handlers.onMouseEnter}
            onMouseLeave={avatarTilt.handlers.onMouseLeave}
            style={{
              rotateX: avatarTilt.rotateX,
              rotateY: avatarTilt.rotateY,
              transformPerspective: 900,
            }}
            whileHover={{ scale: 1.03 }}
            className="rim-light rounded-3xl will-change-transform"
          >
            <PetAvatar
              name={pet.name}
              species={pet.species}
              avatarUrl={pet.avatarUrl}
              size="xl"
            />
          </motion.div>
          <div className="pb-1">
            <h1 className="text-display-sm">{pet.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {getSpeciesLabel(pet.species)}
              {pet.breed ? ` · ${pet.breed}` : ""}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {calculateAge(pet.dateOfBirth)}
            </p>
          </div>
        </div>
        <div className="flex gap-3 pb-1">
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
      </motion.div>

      {/* Background — larger anchored info panels, receded and
          counter-drifting for depth */}
      <motion.div
        style={{ x: backX, y: backY }}
        className="relative z-0 mt-2 grid grid-cols-1 gap-6 lg:grid-cols-2"
      >
        <div className="bg-card rim-light rounded-3xl p-6 shadow-soft">
          <h2 className="mb-1 text-title-md">Details</h2>
          <div className="divide-y divide-border/60">
            <PetInfoRow icon={Calendar} label="Date of Birth" value={formatDate(pet.dateOfBirth)} />
            <PetInfoRow
              icon={VenusAndMars}
              label="Gender"
              value={pet.gender.charAt(0).toUpperCase() + pet.gender.slice(1)}
            />
            <PetInfoRow icon={Scale} label="Weight" value={pet.weightKg ? `${pet.weightKg} kg` : "Not recorded"} />
            <PetInfoRow icon={Palette} label="Color" value={pet.color ?? "Not recorded"} />
            <PetInfoRow icon={Fingerprint} label="Microchip ID" value={pet.microchipId ?? "Not recorded"} />
            <PetInfoRow
              icon={pet.isNeutered ? ShieldCheck : ShieldX}
              label="Neutered / Spayed"
              value={pet.isNeutered ? "Yes" : "No"}
            />
          </div>
        </div>

        <div className="bg-card rim-light rounded-3xl p-6 shadow-soft">
          <div className="mb-3 flex items-center gap-2">
            <StickyNote size={17} className="text-muted-foreground" />
            <h2 className="text-title-md">Notes</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            {pet.notes || "No notes added yet."}
          </p>
        </div>
      </motion.div>

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
