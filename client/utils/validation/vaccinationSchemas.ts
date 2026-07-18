import { z } from "zod";

const todayStr = new Date().toISOString().split("T")[0];

export const vaccinationFormSchema = z
  .object({
    petId: z.string().min(1, "Please select a pet"),
    vaccineName: z.string().min(1, "Vaccine name is required").max(120),
    dateAdministered: z
      .string()
      .min(1, "Date administered is required")
      .refine((val) => val <= todayStr, "Date cannot be in the future"),
    nextDueDate: z.string().optional().or(z.literal("")),
    administeredBy: z.string().max(120).optional().or(z.literal("")),
    clinicName: z.string().max(120).optional().or(z.literal("")),
    batchNumber: z.string().max(80).optional().or(z.literal("")),
    notes: z.string().max(1000).optional().or(z.literal("")),
    reminderEnabled: z.boolean(),
  })
  .refine(
    (data) =>
      !data.nextDueDate || data.nextDueDate >= data.dateAdministered,
    {
      message: "Next due date cannot be before the date administered",
      path: ["nextDueDate"],
    },
  );

export type VaccinationFormValues = z.infer<typeof vaccinationFormSchema>;

export const vaccinationFormDefaults: Omit<VaccinationFormValues, "petId"> = {
  vaccineName: "",
  dateAdministered: todayStr,
  nextDueDate: "",
  administeredBy: "",
  clinicName: "",
  batchNumber: "",
  notes: "",
  reminderEnabled: true,
};

export const commonVaccines = [
  "Rabies",
  "DHPP (Distemper Combo)",
  "Bordetella",
  "Leptospirosis",
  "FVRCP (Feline Combo)",
  "FeLV (Feline Leukemia)",
  "Canine Influenza",
  "Lyme Disease",
];
