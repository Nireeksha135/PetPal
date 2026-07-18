import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import FormField from "@/components/FormField";
import FormSelect from "@/components/FormSelect";
import FormTextarea from "@/components/FormTextarea";
import FormToggle from "@/components/FormToggle";
import Button from "@/components/Button";
import PetSelect from "@/components/medicine/PetSelect";
import type { PetListItem } from "@/types/pet";
import {
  fleaTickFormSchema,
  fleaTickFormDefaults,
  treatmentTypeOptions,
  commonFleaTickProducts,
  type FleaTickFormValues,
} from "@/utils/validation/fleaTickSchemas";
import type { FleaTickFormPayload } from "@/types/fleaTick";

interface FleaTickFormProps {
  pets: PetListItem[];
  defaultValues?: Partial<FleaTickFormValues>;
  lockPet?: boolean;
  onSubmit: (values: FleaTickFormPayload) => void;
  isSubmitting: boolean;
  serverError?: string | null;
  submitLabel?: string;
}

export default function FleaTickForm({
  pets,
  defaultValues,
  lockPet = false,
  onSubmit,
  isSubmitting,
  serverError,
  submitLabel = "Save Treatment",
}: FleaTickFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FleaTickFormValues>({
    resolver: zodResolver(fleaTickFormSchema),
    defaultValues: {
      petId: pets[0]?.id ?? "",
      ...fleaTickFormDefaults,
      ...defaultValues,
    },
  });

  const submit = handleSubmit((values) => {
    onSubmit({
      petId: values.petId,
      productName: values.productName,
      treatmentType: values.treatmentType,
      dateApplied: values.dateApplied,
      nextDueDate: values.nextDueDate || undefined,
      administeredBy: values.administeredBy || undefined,
      notes: values.notes || undefined,
      reminderEnabled: values.reminderEnabled,
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
        <h2 className="mb-4 text-base font-semibold">Treatment Details</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <PetSelect
              pets={pets}
              error={errors.petId?.message}
              {...register("petId")}
              disabled={lockPet}
            />
          </div>
          <div className="sm:col-span-2">
            <FormField
              label="Product Name"
              placeholder="Frontline Plus"
              list="common-flea-tick"
              error={errors.productName?.message}
              {...register("productName")}
            />
            <datalist id="common-flea-tick">
              {commonFleaTickProducts.map((p) => (
                <option key={p} value={p} />
              ))}
            </datalist>
          </div>
          <FormSelect
            label="Treatment Type"
            options={treatmentTypeOptions}
            error={errors.treatmentType?.message}
            {...register("treatmentType")}
          />
          <FormField
            label="Date Applied"
            type="date"
            error={errors.dateApplied?.message}
            {...register("dateApplied")}
          />
          <FormField
            label="Next Due Date (optional)"
            type="date"
            error={errors.nextDueDate?.message}
            {...register("nextDueDate")}
          />
          <FormField
            label="Administered By"
            placeholder="Dr. Smith / Self"
            error={errors.administeredBy?.message}
            {...register("administeredBy")}
          />
        </div>

        <div className="mt-4">
          <Controller
            name="reminderEnabled"
            control={control}
            render={({ field }) => (
              <FormToggle
                label="Reminder Enabled"
                description="Get counted in upcoming/overdue reminders on your dashboard"
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </div>

      <div className="rounded-2xl bg-card p-6 shadow-card">
        <h2 className="mb-4 text-base font-semibold">Notes</h2>
        <FormTextarea
          label="Additional notes"
          placeholder="Reactions, effectiveness, vet notes"
          error={errors.notes?.message}
          {...register("notes")}
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
