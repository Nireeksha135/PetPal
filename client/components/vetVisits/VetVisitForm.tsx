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
  vetVisitFormSchema,
  vetVisitFormDefaults,
  visitTypeOptions,
  type VetVisitFormValues,
} from "@/utils/validation/vetVisitSchemas";
import type { VetVisitFormPayload } from "@/types/vetVisit";

interface VetVisitFormProps {
  pets: PetListItem[];
  defaultValues?: Partial<VetVisitFormValues>;
  lockPet?: boolean;
  onSubmit: (values: VetVisitFormPayload) => void;
  isSubmitting: boolean;
  serverError?: string | null;
  submitLabel?: string;
}

export default function VetVisitForm({
  pets,
  defaultValues,
  lockPet = false,
  onSubmit,
  isSubmitting,
  serverError,
  submitLabel = "Save Visit",
}: VetVisitFormProps) {
  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<VetVisitFormValues>({
    resolver: zodResolver(vetVisitFormSchema),
    defaultValues: {
      petId: pets[0]?.id ?? "",
      ...vetVisitFormDefaults,
      ...defaultValues,
    },
  });

  const followUpNeeded = watch("followUpNeeded");

  const submit = handleSubmit((values) => {
    onSubmit({
      petId: values.petId,
      visitDate: values.visitDate,
      visitType: values.visitType,
      reason: values.reason,
      vetName: values.vetName || undefined,
      clinicName: values.clinicName || undefined,
      diagnosis: values.diagnosis || undefined,
      treatment: values.treatment || undefined,
      cost: values.cost,
      followUpDate: values.followUpDate || undefined,
      followUpNeeded: values.followUpNeeded,
      notes: values.notes || undefined,
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
        <h2 className="mb-4 text-base font-semibold">Visit Details</h2>
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
            label="Visit Date"
            type="date"
            error={errors.visitDate?.message}
            {...register("visitDate")}
          />
          <FormSelect
            label="Visit Type"
            options={visitTypeOptions}
            error={errors.visitType?.message}
            {...register("visitType")}
          />
          <div className="sm:col-span-2">
            <FormField
              label="Reason for Visit"
              placeholder="Annual checkup, limping, vomiting..."
              error={errors.reason?.message}
              {...register("reason")}
            />
          </div>
          <FormField
            label="Vet Name"
            placeholder="Dr. Smith"
            error={errors.vetName?.message}
            {...register("vetName")}
          />
          <FormField
            label="Clinic Name"
            placeholder="Sunny Paws Veterinary"
            error={errors.clinicName?.message}
            {...register("clinicName")}
          />
          <FormField
            label="Cost"
            type="number"
            step="0.01"
            placeholder="0.00"
            error={errors.cost?.message as string | undefined}
            {...register("cost")}
          />
        </div>
      </div>

      <div className="rounded-2xl bg-card p-6 shadow-card">
        <h2 className="mb-4 text-base font-semibold">Diagnosis & Treatment</h2>
        <div className="flex flex-col gap-4">
          <FormTextarea
            label="Diagnosis"
            placeholder="Vet's diagnosis"
            error={errors.diagnosis?.message}
            {...register("diagnosis")}
          />
          <FormTextarea
            label="Treatment"
            placeholder="Treatment plan or prescriptions given"
            error={errors.treatment?.message}
            {...register("treatment")}
          />
        </div>
      </div>

      <div className="rounded-2xl bg-card p-6 shadow-card">
        <h2 className="mb-4 text-base font-semibold">Follow-up</h2>
        <Controller
          name="followUpNeeded"
          control={control}
          render={({ field }) => (
            <FormToggle
              label="Follow-up Needed"
              description="Will this visit need a scheduled follow-up?"
              checked={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {followUpNeeded && (
          <div className="mt-4">
            <FormField
              label="Follow-up Date"
              type="date"
              error={errors.followUpDate?.message}
              {...register("followUpDate")}
            />
          </div>
        )}
      </div>

      <div className="rounded-2xl bg-card p-6 shadow-card">
        <h2 className="mb-4 text-base font-semibold">Notes</h2>
        <FormTextarea
          label="Additional notes"
          placeholder="Anything else worth remembering"
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
