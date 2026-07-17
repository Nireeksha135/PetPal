import { z } from "zod";

export const petSpeciesOptions = [
  { value: "dog", label: "Dog" },
  { value: "cat", label: "Cat" },
  { value: "bird", label: "Bird" },
  { value: "rabbit", label: "Rabbit" },
  { value: "fish", label: "Fish" },
  { value: "reptile", label: "Reptile" },
  { value: "rodent", label: "Rodent" },
  { value: "other", label: "Other" },
] as const;

export const petGenderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "unknown", label: "Unknown" },
] as const;

const todayStr = new Date().toISOString().split("T")[0];

export const petFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(80, "Name is too long")
    .trim(),
  species: z.enum([
    "dog",
    "cat",
    "bird",
    "rabbit",
    "fish",
    "reptile",
    "rodent",
    "other",
  ]),
  breed: z.string().max(120, "Breed is too long").optional().or(z.literal("")),
  gender: z.enum(["male", "female", "unknown"]),
  dateOfBirth: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => !val || val <= todayStr,
      "Date of birth cannot be in the future",
    ),
  weightKg: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => {
      if (val === "" || val === undefined) return undefined;
      const num = typeof val === "string" ? Number(val) : val;
      return Number.isNaN(num) ? undefined : num;
    })
    .refine((val) => val === undefined || (val >= 0 && val <= 500), {
      message: "Weight must be between 0 and 500 kg",
    }),
  color: z.string().max(80, "Color is too long").optional().or(z.literal("")),
  microchipId: z
    .string()
    .max(80, "Microchip ID is too long")
    .optional()
    .or(z.literal("")),
  isNeutered: z.boolean(),
  notes: z
    .string()
    .max(2000, "Notes must be under 2000 characters")
    .optional()
    .or(z.literal("")),
});

export type PetFormValues = z.infer<typeof petFormSchema>;

export const petFormDefaults: PetFormValues = {
  name: "",
  species: "dog",
  breed: "",
  gender: "unknown",
  dateOfBirth: "",
  weightKg: undefined,
  color: "",
  microchipId: "",
  isNeutered: false,
  notes: "",
};
