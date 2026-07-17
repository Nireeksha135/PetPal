import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import FormField from "@/components/FormField";
import FormSelect from "@/components/FormSelect";
import FormTextarea from "@/components/FormTextarea";
import Button from "@/components/Button";
import PetSelect from "./PetSelect";
import type { PetListItem } from "@/types/pet";
import {
  medicineFormSchema,
  medicineFormDefaults,
  medicineFrequencyOptions,
  type MedicineFormValues,
} from "@/utils/validation/medicineSchemas";
import type { MedicineFormPayload } from "@/types/medicine";

interface MedicineFormProps {
  pets: PetListItem[];
  defaultValues?: Partial<MedicineFormValues>;
  lockPet?: boolean;
  onSubmit: (values: MedicineFormPayload) => void;
  isSubmitting: boolean;
  serverError?: string | null;
  submitLabel?: string;
}

export default function MedicineForm({
  pets,
  defaultValues,
  lockPet = false,
  onSubmit,
  isSubmitting,
  serverError,
  submitLabel = "Save Medicine",
}: MedicineFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MedicineFormValues>({
    resolver: zodResolver(medicineFormSchema),
    defaultValues: {
      petId: pets[0]?.id ?? "",
      ...medicineFormDefaults,
      ...defaultValues,
    },
  });

  const submit = handleSubmit((values) => {
    onSubmit({
      petId: values.petId,
      name: values.name,
      dosage: values.dosage,
      frequency: values.frequency,
      timesPerDay: values.timesPerDay,
      startDate: values.startDate,
      endDate: values.endDate || undefined,
      instructions: values.instructions || undefined,
      prescribedBy: values.prescribedBy || undefined,
      isActive: values.isActive,
    });
  });

  return (
    <form onSubmit={submit} className="flex flex-col gap-6" noValidate>
      {serverError && (
        <div className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {serverError}
        </div>
      )}

      <div className="rounded-2xl bg-card p-6 shadow-card">
        <h2 className="mb-4 text-base font-semibold">Medicine Details</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <PetSelect
              pets={pets}
              error={errors.petId?.message}
              {...register("petId")}
              disabled={lockPet}
            />
          </div>
          <FormField
            label="Medicine Name"
            placeholder="Amoxicillin"
            error={errors.name?.message}
            {...register("name")}
          />
          <FormField
            label="Dosage"
            placeholder="250mg, 1 tablet"
            error={errors.dosage?.message}
            {...register("dosage")}
          />
          <FormSelect
            label="Frequency"
            options={medicineFrequencyOptions}
            error={errors.frequency?.message}
            {...register("frequency")}
          />
          <FormField
            label="Times Per Day"
            type="number"
            min={1}
            max={12}
            error={errors.timesPerDay?.message}
            {...register("timesPerDay")}
          />
          <FormField
            label="Start Date"
            type="date"
            error={errors.startDate?.message}
            {...register("startDate")}
          />
          <FormField
            label="End Date (optional)"
            type="date"
            error={errors.endDate?.message}
            {...register("endDate")}
          />
          <FormField
            label="Prescribed By"
            placeholder="Dr. Smith"
            error={errors.prescribedBy?.message}
            {...register("prescribedBy")}
          />
        </div>
      </div>

      <div className="rounded-2xl bg-card p-6 shadow-card">
        <h2 className="mb-4 text-base font-semibold">Instructions</h2>
        <FormTextarea
          label="Additional instructions"
          placeholder="Give with food, avoid dairy, etc."
          error={errors.instructions?.message}
          {...register("instructions")}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit" isLoading={isSubmitting}>
          <Save size={16} />
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
