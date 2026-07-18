import { z } from "zod";

const todayStr = new Date().toISOString().split("T")[0];

export const treatmentTypeOptions = [
  { value: "topical", label: "Topical" },
  { value: "oral", label: "Oral" },
  { value: "collar", label: "Collar" },
  { value: "shampoo", label: "Shampoo" },
  { value: "spray", label: "Spray" },
  { value: "other", label: "Other" },
] as const;

export const fleaTickFormSchema = z
  .object({
    petId: z.string().min(1, "Please select a pet"),
    productName: z.string().min(1, "Product name is required").max(120),
    treatmentType: z.enum([
      "topical",
      "oral",
      "collar",
      "shampoo",
      "spray",
      "other",
    ]),
    dateApplied: z
      .string()
      .min(1, "Date applied is required")
      .refine((val) => val <= todayStr, "Date cannot be in the future"),
    nextDueDate: z.string().optional().or(z.literal("")),
    administeredBy: z.string().max(120).optional().or(z.literal("")),
    notes: z.string().max(1000).optional().or(z.literal("")),
    reminderEnabled: z.boolean(),
  })
  .refine(
    (data) => !data.nextDueDate || data.nextDueDate >= data.dateApplied,
    { message: "Next due date cannot be before the date applied", path: ["nextDueDate"] },
  );

export type FleaTickFormValues = z.infer<typeof fleaTickFormSchema>;

export const fleaTickFormDefaults: Omit<FleaTickFormValues, "petId"> = {
  productName: "",
  treatmentType: "topical",
  dateApplied: todayStr,
  nextDueDate: "",
  administeredBy: "",
  notes: "",
  reminderEnabled: true,
};

export const commonFleaTickProducts = [
  "Frontline Plus",
  "NexGard",
  "Bravecto",
  "Seresto Collar",
  "Advantage II",
  "Simparica",
];
