export type TreatmentType =
  | "topical"
  | "oral"
  | "collar"
  | "shampoo"
  | "spray"
  | "other";

export interface FleaTickTreatment {
  id: string;
  petId: string;
  ownerId: string;
  productName: string;
  treatmentType: TreatmentType;
  dateApplied: string;
  nextDueDate: string | null;
  administeredBy: string | null;
  notes: string | null;
  reminderEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FleaTickFormPayload {
  petId: string;
  productName: string;
  treatmentType: TreatmentType;
  dateApplied: string;
  nextDueDate?: string;
  administeredBy?: string;
  notes?: string;
  reminderEnabled: boolean;
}

interface RawFleaTickTreatment {
  id: string;
  pet_id: string;
  owner_id: string;
  product_name: string;
  treatment_type: TreatmentType;
  date_applied: string;
  next_due_date: string | null;
  administered_by: string | null;
  notes: string | null;
  reminder_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export function mapFleaTickTreatment(raw: RawFleaTickTreatment): FleaTickTreatment {
  return {
    id: raw.id,
    petId: raw.pet_id,
    ownerId: raw.owner_id,
    productName: raw.product_name,
    treatmentType: raw.treatment_type,
    dateApplied: raw.date_applied,
    nextDueDate: raw.next_due_date,
    administeredBy: raw.administered_by,
    notes: raw.notes,
    reminderEnabled: raw.reminder_enabled,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

export function toFleaTickPayload(payload: FleaTickFormPayload) {
  return {
    pet_id: payload.petId,
    product_name: payload.productName,
    treatment_type: payload.treatmentType,
    date_applied: payload.dateApplied,
    next_due_date: payload.nextDueDate || null,
    administered_by: payload.administeredBy || null,
    notes: payload.notes || null,
    reminder_enabled: payload.reminderEnabled,
  };
}
