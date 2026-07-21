import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useDietPlan, useDeleteDietPlan } from "@/hooks/useDietPlans";
import { usePet } from "@/hooks/usePet";
import Skeleton from "@/components/Skeleton";
import ErrorState from "@/components/ErrorState";
import Button from "@/components/Button";
import DeletePetDialog from "@/components/pets/DeletePetDialog";
import DietDisclaimerBanner from "@/components/diet/DietDisclaimerBanner";
import DietPlanResult from "@/components/diet/DietPlanResult";
import PetInfoRow from "@/components/pets/PetInfoRow";
import { Weight, Target, AlertCircle, HeartPulse } from "lucide-react";
import { formatDate } from "@/utils/dietMeta";

export default function DietPlanDetail() {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const { data: plan, isLoading, isError, refetch } = useDietPlan(planId);
  const { data: pet } = usePet(plan?.petId);
  const deleteMutation = useDeleteDietPlan();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !plan) {
    return <ErrorState title="Diet plan not found" onRetry={() => refetch()} />;
  }

  const handleDelete = () => {
    deleteMutation.mutate(
      { planId: plan.id, petId: plan.petId },
      { onSuccess: () => navigate("/diet-assistant", { replace: true }) },
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/diet-assistant"
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Back to Diet Assistant
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {pet ? `${pet.name}'s ` : ""}Diet Plan
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatDate(plan.createdAt)}
          </p>
        </div>
        <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
          <Trash2 size={16} />
          Delete
        </Button>
      </div>

      <DietDisclaimerBanner />

      {(plan.currentWeightKg || plan.goalWeightKg || plan.allergies || plan.healthConditions) && (
        <div className="rounded-2xl bg-card p-6 shadow-card">
          <h2 className="mb-1 text-base font-semibold">Details Provided</h2>
          <div className="divide-y divide-border">
            {plan.currentWeightKg && (
              <PetInfoRow
                icon={Weight}
                label="Current Weight"
                value={`${plan.currentWeightKg} kg`}
              />
            )}
            {plan.goalWeightKg && (
              <PetInfoRow
                icon={Target}
                label="Goal Weight"
                value={`${plan.goalWeightKg} kg`}
              />
            )}
            {plan.allergies && (
              <PetInfoRow icon={AlertCircle} label="Allergies" value={plan.allergies} />
            )}
            {plan.healthConditions && (
              <PetInfoRow
                icon={HeartPulse}
                label="Health Conditions"
                value={plan.healthConditions}
              />
            )}
          </div>
        </div>
      )}

      <DietPlanResult plan={plan} />

      <DeletePetDialog
        open={deleteDialogOpen}
        petName="this diet plan"
        isDeleting={deleteMutation.isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
}
