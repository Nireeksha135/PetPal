import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import FormField from "@/components/FormField";
import FormTextarea from "@/components/FormTextarea";
import FormToggle from "@/components/FormToggle";
import Button from "@/components/Button";
import PetSelect from "@/components/medicine/PetSelect";
import type { PetListItem } from "@/types/pet";
import {
  dewormingFormSchema,
  dewormingFormDefaults,
  commonDewormers,
  type DewormingFormValues,
} from "@/utils/validation/dewormingSchemas";
import type { DewormingFormPayload } from "@/types/deworming";

interface DewormingFormProps {
  pets: PetListItem[];
  defaultValues?: Partial<DewormingFormValues>;
  lockPet?: boolean;
  onSubmit: (values: DewormingFormPayload) => void;
  isSubmitting: boolean;
  serverError?: string | null;
  submitLabel?: string;
}

export default function DewormingForm({
  pets,
  defaultValues,
  lockPet = false,
  onSubmit,
  isSubmitting,
  serverError,
  submitLabel = "Save Record",
}: DewormingFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DewormingFormValues>({
    resolver: zodResolver(dewormingFormSchema),
    defaultValues: {
      petId: pets[0]?.id ?? "",
      ...dewormingFormDefaults,
      ...defaultValues,
    },
  });

  const submit = handleSubmit((values) => {
    onSubmit({
      petId: values.petId,
      productName: values.productName,
      dateGiven: values.dateGiven,
      nextDueDate: values.nextDueDate || undefined,
      dosage: values.dosage || undefined,
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
        <h2 className="mb-4 text-base font-semibold">Deworming Details</h2>
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
              placeholder="Drontal Plus"
              list="common-dewormers"
              error={errors.productName?.message}
              {...register("productName")}
            />
            <datalist id="common-dewormers">
              {commonDewormers.map((d) => (
                <option key={d} value={d} />
              ))}
            </datalist>
          </div>
          <FormField
            label="Date Given"
            type="date"
            error={errors.dateGiven?.message}
            {...register("dateGiven")}
          />
          <FormField
            label="Next Due Date (optional)"
            type="date"
            error={errors.nextDueDate?.message}
            {...register("nextDueDate")}
          />
          <FormField
            label="Dosage"
            placeholder="1 tablet, 5ml"
            error={errors.dosage?.message}
            {...register("dosage")}
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
          placeholder="Any observations or vet recommendations"
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
