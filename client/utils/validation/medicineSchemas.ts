import { z } from "zod";

export const medicineFrequencyOptions = [
  { value: "once_daily", label: "Once Daily" },
  { value: "twice_daily", label: "Twice Daily" },
  { value: "three_times_daily", label: "Three Times Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "as_needed", label: "As Needed" },
  { value: "custom", label: "Custom" },
] as const;

export const medicineFormSchema = z
  .object({
    petId: z.string().min(1, "Please select a pet"),
    name: z.string().min(1, "Medicine name is required").max(120),
    dosage: z.string().min(1, "Dosage is required").max(80),
    frequency: z.enum([
      "once_daily",
      "twice_daily",
      "three_times_daily",
      "weekly",
      "as_needed",
      "custom",
    ]),
    timesPerDay: z.coerce.number().int().min(1).max(12),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional().or(z.literal("")),
    instructions: z.string().max(1000).optional().or(z.literal("")),
    prescribedBy: z.string().max(120).optional().or(z.literal("")),
    isActive: z.boolean(),
  })
  .refine(
    (data) => !data.endDate || data.endDate >= data.startDate,
    { message: "End date cannot be before start date", path: ["endDate"] },
  );

export type MedicineFormValues = z.infer<typeof medicineFormSchema>;

export const medicineFormDefaults: Omit<MedicineFormValues, "petId"> = {
  name: "",
  dosage: "",
  frequency: "once_daily",
  timesPerDay: 1,
  startDate: new Date().toISOString().split("T")[0],
  endDate: "",
  instructions: "",
  prescribedBy: "",
  isActive: true,
};
