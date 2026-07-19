import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { Sparkles, Camera, X } from "lucide-react";
import FormTextarea from "@/components/FormTextarea";
import Button from "@/components/Button";
import PetSelect from "@/components/medicine/PetSelect";
import type { PetListItem } from "@/types/pet";

interface SymptomFormValues {
  petId: string;
  symptoms: string;
}

interface SymptomFormProps {
  pets: PetListItem[];
  defaultPetId?: string;
  isSubmitting: boolean;
  serverError?: string | null;
  onSubmit: (values: { petId: string; symptoms: string; image: File | null }) => void;
}

export default function SymptomForm({
  pets,
  defaultPetId,
  isSubmitting,
  serverError,
  onSubmit,
}: SymptomFormProps) {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SymptomFormValues>({
    defaultValues: { petId: defaultPetId ?? pets[0]?.id ?? "", symptoms: "" },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxFiles: 1,
    maxSize: 8 * 1024 * 1024,
  });

  const submit = handleSubmit((values) => {
    onSubmit({ petId: values.petId, symptoms: values.symptoms, image });
  });

  return (
    <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
      {serverError && (
        <div className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {serverError}
        </div>
      )}

      <PetSelect
        pets={pets}
        label="Which pet?"
        error={errors.petId?.message}
        {...register("petId", { required: "Please select a pet" })}
      />

      <FormTextarea
        label="Describe what you're noticing"
        placeholder="e.g. My dog has been scratching his left ear and shaking his head since yesterday..."
        error={errors.symptoms?.message}
        rows={5}
        {...register("symptoms", {
          required: "Please describe the symptoms",
          minLength: { value: 10, message: "Please add a bit more detail" },
          maxLength: { value: 2000, message: "Keep it under 2000 characters" },
        })}
      />

      {preview ? (
        <div className="relative w-fit">
          <img
            src={preview}
            alt="Symptom preview"
            className="h-32 w-32 rounded-xl object-cover shadow-soft"
          />
          <button
            type="button"
            onClick={() => {
              setImage(null);
              setPreview(null);
            }}
            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-white shadow-soft"
            aria-label="Remove photo"
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-border px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-primary/50"
        >
          <input {...getInputProps()} />
          <Camera size={18} />
          {isDragActive ? "Drop the photo here" : "Add a photo (optional)"}
        </div>
      )}

      <Button type="submit" isLoading={isSubmitting} fullWidth>
        <Sparkles size={16} />
        Ask AI Pet Doctor
      </Button>
    </form>
  );
}
