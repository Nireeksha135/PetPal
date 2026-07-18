import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { Controller } from "react-hook-form";
import FormField from "@/components/FormField";
import FormTextarea from "@/components/FormTextarea";
import FormToggle from "@/components/FormToggle";
import Button from "@/components/Button";
import PetSelect from "@/components/medicine/PetSelect";
import type { PetListItem } from "@/types/pet";
import {
  vaccinationFormSchema,
  vaccinationFormDefaults,
  commonVaccines,
  type VaccinationFormValues,
} from "@/utils/validation/vaccinationSchemas";
import type { VaccinationFormPayload } from "@/types/vaccination";

interface VaccinationFormProps {
  pets: PetListItem[];
  defaultValues?: Partial<VaccinationFormValues>;
  lockPet?: boolean;
  onSubmit: (values: VaccinationFormPayload) => void;
  isSubmitting: boolean;
  serverError?: string | null;
  submitLabel?: string;
}

export default function VaccinationForm({
  pets,
  defaultValues,
  lockPet = false,
  onSubmit,
  isSubmitting,
  serverError,
  submitLabel = "Save Vaccination",
}: VaccinationFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VaccinationFormValues>({
    resolver: zodResolver(vaccinationFormSchema),
    defaultValues: {
      petId: pets[0]?.id ?? "",
      ...vaccinationFormDefaults,
      ...defaultValues,
    },
  });

  const submit = handleSubmit((values) => {
    onSubmit({
      petId: values.petId,
      vaccineName: values.vaccineName,
      dateAdministered: values.dateAdministered,
      nextDueDate: values.nextDueDate || undefined,
      administeredBy: values.administeredBy || undefined,
      clinicName: values.clinicName || undefined,
      batchNumber: values.batchNumber || undefined,
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
        <h2 className="mb-4 text-base font-semibold">Vaccination Details</h2>
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
              label="Vaccine Name"
              placeholder="Rabies"
              list="common-vaccines"
              error={errors.vaccineName?.message}
              {...register("vaccineName")}
            />
            <datalist id="common-vaccines">
              {commonVaccines.map((v) => (
                <option key={v} value={v} />
              ))}
            </datalist>
          </div>
          <FormField
            label="Date Administered"
            type="date"
            error={errors.dateAdministered?.message}
            {...register("dateAdministered")}
          />
          <FormField
            label="Next Due Date (optional)"
            type="date"
            error={errors.nextDueDate?.message}
            {...register("nextDueDate")}
          />
          <FormField
            label="Administered By"
            placeholder="Dr. Smith"
            error={errors.administeredBy?.message}
            {...register("administeredBy")}
          />
          <FormField
            label="Clinic Name"
            placeholder="Sunny Paws Veterinary"
            error={errors.clinicName?.message}
            {...register("clinicName")}
          />
          <FormField
            label="Batch Number"
            placeholder="Optional"
            error={errors.batchNumber?.message}
            {...register("batchNumber")}
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
          placeholder="Reaction observed, vet recommendations, etc."
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
