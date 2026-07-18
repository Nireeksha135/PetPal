import { z } from "zod";

const todayStr = new Date().toISOString().split("T")[0];

export const dewormingFormSchema = z
  .object({
    petId: z.string().min(1, "Please select a pet"),
    productName: z.string().min(1, "Product name is required").max(120),
    dateGiven: z
      .string()
      .min(1, "Date given is required")
      .refine((val) => val <= todayStr, "Date cannot be in the future"),
    nextDueDate: z.string().optional().or(z.literal("")),
    dosage: z.string().max(80).optional().or(z.literal("")),
    administeredBy: z.string().max(120).optional().or(z.literal("")),
    notes: z.string().max(1000).optional().or(z.literal("")),
    reminderEnabled: z.boolean(),
  })
  .refine((data) => !data.nextDueDate || data.nextDueDate >= data.dateGiven, {
    message: "Next due date cannot be before the date given",
    path: ["nextDueDate"],
  });

export type DewormingFormValues = z.infer<typeof dewormingFormSchema>;

export const dewormingFormDefaults: Omit<DewormingFormValues, "petId"> = {
  productName: "",
  dateGiven: todayStr,
  nextDueDate: "",
  dosage: "",
  administeredBy: "",
  notes: "",
  reminderEnabled: true,
};

export const commonDewormers = [
  "Drontal Plus",
  "Panacur (Fenbendazole)",
  "Heartgard Plus",
  "Milbemax",
  "Interceptor",
  "Advocate",
];
