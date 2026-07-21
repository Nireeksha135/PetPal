import { useForm, Controller } from "react-hook-form";
import { Sparkles } from "lucide-react";
import FormField from "@/components/FormField";
import FormSelect from "@/components/FormSelect";
import FormTextarea from "@/components/FormTextarea";
import Button from "@/components/Button";
import PetSelect from "@/components/medicine/PetSelect";
import type { PetListItem } from "@/types/pet";
import { activityLevelOptions, bodyConditionOptions } from "@/utils/dietMeta";
import type { DietPlanRequestPayload, ActivityLevel, BodyCondition } from "@/types/dietPlan";

interface DietPlanFormValues {
  petId: string;
  activityLevel: ActivityLevel;
  bodyCondition: BodyCondition;
  currentWeightKg: string;
  goalWeightKg: string;
  allergies: string;
  healthConditions: string;
  additionalNotes: string;
}

interface DietPlanFormProps {
  pets: PetListItem[];
  defaultPetId?: string;
  isSubmitting: boolean;
  onSubmit: (payload: DietPlanRequestPayload) => void;
}

export default function DietPlanForm({
  pets,
  defaultPetId,
  isSubmitting,
  onSubmit,
}: DietPlanFormProps) {
  const { register, control, handleSubmit } = useForm<DietPlanFormValues>({
    defaultValues: {
      petId: defaultPetId ?? pets[0]?.id ?? "",
      activityLevel: "moderate",
      bodyCondition: "unknown",
      currentWeightKg: "",
      goalWeightKg: "",
      allergies: "",
      healthConditions: "",
      additionalNotes: "",
    },
  });

  const submit = handleSubmit((values) => {
    onSubmit({
      petId: values.petId,
      activityLevel: values.activityLevel,
      bodyCondition: values.bodyCondition,
      currentWeightKg: values.currentWeightKg ? Number(values.currentWeightKg) : undefined,
      goalWeightKg: values.goalWeightKg ? Number(values.goalWeightKg) : undefined,
      allergies: values.allergies || undefined,
      healthConditions: values.healthConditions || undefined,
      additionalNotes: values.additionalNotes || undefined,
    });
  });

  return (
    <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
      <PetSelect pets={pets} label="Pet" {...register("petId")} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormSelect
          label="Activity Level"
          options={activityLevelOptions}
          {...register("activityLevel")}
        />
        <FormSelect
          label="Body Condition"
          options={bodyConditionOptions}
          {...register("bodyCondition")}
        />
        <FormField
          label="Current Weight (kg)"
          type="number"
          step="0.1"
          placeholder="Optional"
          {...register("currentWeightKg")}
        />
        <FormField
          label="Goal Weight (kg)"
          type="number"
          step="0.1"
          placeholder="Optional"
          {...register("goalWeightKg")}
        />
      </div>

      <FormField
        label="Allergies (optional)"
        placeholder="Chicken, grain, dairy..."
        {...register("allergies")}
      />

      <FormField
        label="Health Conditions (optional)"
        placeholder="Diabetes, kidney disease..."
        {...register("healthConditions")}
      />

      <FormTextarea
        label="Anything else PetPal should know? (optional)"
        placeholder="Picky eater, food sensitivities, current diet..."
        {...register("additionalNotes")}
      />

      <Button type="submit" isLoading={isSubmitting} fullWidth>
        <Sparkles size={16} />
        Generate Diet Plan
      </Button>
    </form>
  );
}
