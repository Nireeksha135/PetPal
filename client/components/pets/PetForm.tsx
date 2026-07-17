import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import FormField from "@/components/FormField";
import FormSelect from "@/components/FormSelect";
import FormTextarea from "@/components/FormTextarea";
import FormToggle from "@/components/FormToggle";
import Button from "@/components/Button";
import {
  petFormSchema,
  petFormDefaults,
  petSpeciesOptions,
  petGenderOptions,
  type PetFormValues,
} from "@/utils/validation/petSchemas";
import type { PetFormPayload } from "@/types/pet";

interface PetFormProps {
  defaultValues?: Partial<PetFormValues>;
  onSubmit: (values: PetFormPayload) => void;
  isSubmitting: boolean;
  serverError?: string | null;
  submitLabel?: string;
}

export default function PetForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  serverError,
  submitLabel = "Save Pet",
}: PetFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PetFormValues>({
    resolver: zodResolver(petFormSchema),
    defaultValues: { ...petFormDefaults, ...defaultValues },
  });

  const submit = handleSubmit((values) => {
    onSubmit({
      name: values.name,
      species: values.species,
      breed: values.breed || undefined,
      gender: values.gender,
      dateOfBirth: values.dateOfBirth || undefined,
      weightKg: values.weightKg,
      color: values.color || undefined,
      microchipId: values.microchipId || undefined,
      isNeutered: values.isNeutered,
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
        <h2 className="mb-4 text-base font-semibold">Basic Info</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            label="Name"
            placeholder="Bella"
            error={errors.name?.message}
            {...register("name")}
          />
          <FormSelect
            label="Species"
            options={petSpeciesOptions}
            error={errors.species?.message}
            {...register("species")}
          />
          <FormField
            label="Breed"
            placeholder="Golden Retriever"
            error={errors.breed?.message}
            {...register("breed")}
          />
          <FormSelect
            label="Gender"
            options={petGenderOptions}
            error={errors.gender?.message}
            {...register("gender")}
          />
          <FormField
            label="Date of Birth"
            type="date"
            error={errors.dateOfBirth?.message}
            {...register("dateOfBirth")}
          />
          <FormField
            label="Weight (kg)"
            type="number"
            step="0.1"
            placeholder="12.5"
            error={errors.weightKg?.message as string | undefined}
            {...register("weightKg")}
          />
          <FormField
            label="Color"
            placeholder="Golden"
            error={errors.color?.message}
            {...register("color")}
          />
          <FormField
            label="Microchip ID"
            placeholder="985121000000000"
            error={errors.microchipId?.message}
            {...register("microchipId")}
          />
        </div>

        <div className="mt-4">
          <Controller
            name="isNeutered"
            control={control}
            render={({ field }) => (
              <FormToggle
                label="Neutered / Spayed"
                description="Has this pet been neutered or spayed?"
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
          placeholder="Allergies, personality, favorite toys, anything worth remembering..."
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
