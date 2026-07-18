import { z } from "zod";

const maxFutureDate = new Date();
maxFutureDate.setFullYear(maxFutureDate.getFullYear() + 2);
const maxFutureStr = maxFutureDate.toISOString().split("T")[0];

export const visitTypeOptions = [
  { value: "checkup", label: "Checkup" },
  { value: "sick_visit", label: "Sick Visit" },
  { value: "surgery", label: "Surgery" },
  { value: "emergency", label: "Emergency" },
  { value: "dental", label: "Dental" },
  { value: "grooming", label: "Grooming" },
  { value: "follow_up", label: "Follow-up" },
  { value: "other", label: "Other" },
] as const;

export const vetVisitFormSchema = z
  .object({
    petId: z.string().min(1, "Please select a pet"),
    visitDate: z
      .string()
      .min(1, "Visit date is required")
      .refine((val) => val <= maxFutureStr, "Visit date is too far in the future"),
    visitType: z.enum([
      "checkup",
      "sick_visit",
      "surgery",
      "emergency",
      "dental",
      "grooming",
      "follow_up",
      "other",
    ]),
    reason: z.string().min(1, "Reason is required").max(200),
    vetName: z.string().max(120).optional().or(z.literal("")),
    clinicName: z.string().max(120).optional().or(z.literal("")),
    diagnosis: z.string().max(1000).optional().or(z.literal("")),
    treatment: z.string().max(1000).optional().or(z.literal("")),
    cost: z
      .union([z.string(), z.number()])
      .optional()
      .transform((val) => {
        if (val === "" || val === undefined) return undefined;
        const num = typeof val === "string" ? Number(val) : val;
        return Number.isNaN(num) ? undefined : num;
      })
      .refine((val) => val === undefined || (val >= 0 && val <= 1_000_000), {
        message: "Cost must be a positive number",
      }),
    followUpDate: z.string().optional().or(z.literal("")),
    followUpNeeded: z.boolean(),
    notes: z.string().max(1000).optional().or(z.literal("")),
  })
  .refine(
    (data) => !data.followUpDate || data.followUpDate >= data.visitDate,
    { message: "Follow-up date cannot be before the visit date", path: ["followUpDate"] },
  );

export type VetVisitFormValues = z.infer<typeof vetVisitFormSchema>;

export const vetVisitFormDefaults: Omit<VetVisitFormValues, "petId"> = {
  visitDate: new Date().toISOString().split("T")[0],
  visitType: "checkup",
  reason: "",
  vetName: "",
  clinicName: "",
  diagnosis: "",
  treatment: "",
  cost: undefined,
  followUpDate: "",
  followUpNeeded: false,
  notes: "",
};
