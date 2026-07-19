import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useState } from "react";
import { useConsultation, useDeleteConsultation } from "@/hooks/useAIDoctor";
import { usePet } from "@/hooks/usePet";
import Skeleton from "@/components/Skeleton";
import ErrorState from "@/components/ErrorState";
import Button from "@/components/Button";
import DeletePetDialog from "@/components/pets/DeletePetDialog";
import AIDisclaimerBanner from "@/components/aiDoctor/AIDisclaimerBanner";
import AIResponseCard from "@/components/aiDoctor/AIResponseCard";

export default function AIConsultationDetail() {
  const { consultationId } = useParams<{ consultationId: string }>();
  const navigate = useNavigate();
  const { data: consultation, isLoading, isError, refetch } = useConsultation(consultationId);
  const { data: pet } = usePet(consultation?.petId);
  const deleteMutation = useDeleteConsultation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !consultation) {
    return <ErrorState title="Consultation not found" onRetry={() => refetch()} />;
  }

  const handleDelete = () => {
    deleteMutation.mutate(
      { consultationId: consultation.id, petId: consultation.petId },
      { onSuccess: () => navigate("/ai-pet-doctor", { replace: true }) },
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/ai-pet-doctor"
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Back to AI Pet Doctor
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {consultation.title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {pet ? `${pet.name} · ` : ""}
            {new Date(consultation.createdAt).toLocaleDateString(undefined, {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
          <Trash2 size={16} />
          Delete
        </Button>
      </div>

      <AIDisclaimerBanner />

      <div className="rounded-2xl bg-card p-6 shadow-card">
        <h2 className="mb-2 text-base font-semibold">What was described</h2>
        <p className="whitespace-pre-wrap text-sm text-muted-foreground">
          {consultation.symptoms}
        </p>
      </div>

      <AIResponseCard consultation={consultation} />

      <DeletePetDialog
        open={deleteDialogOpen}
        petName={consultation.title}
        isDeleting={deleteMutation.isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
}
