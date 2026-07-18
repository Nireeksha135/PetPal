export interface Deworming {
  id: string;
  petId: string;
  ownerId: string;
  productName: string;
  dateGiven: string;
  nextDueDate: string | null;
  dosage: string | null;
  administeredBy: string | null;
  notes: string | null;
  reminderEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DewormingFormPayload {
  petId: string;
  productName: string;
  dateGiven: string;
  nextDueDate?: string;
  dosage?: string;
  administeredBy?: string;
  notes?: string;
  reminderEnabled: boolean;
}

interface RawDeworming {
  id: string;
  pet_id: string;
  owner_id: string;
  product_name: string;
  date_given: string;
  next_due_date: string | null;
  dosage: string | null;
  administered_by: string | null;
  notes: string | null;
  reminder_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export function mapDeworming(raw: RawDeworming): Deworming {
  return {
    id: raw.id,
    petId: raw.pet_id,
    ownerId: raw.owner_id,
    productName: raw.product_name,
    dateGiven: raw.date_given,
    nextDueDate: raw.next_due_date,
    dosage: raw.dosage,
    administeredBy: raw.administered_by,
    notes: raw.notes,
    reminderEnabled: raw.reminder_enabled,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

export function toDewormingPayload(payload: DewormingFormPayload) {
  return {
    pet_id: payload.petId,
    product_name: payload.productName,
    date_given: payload.dateGiven,
    next_due_date: payload.nextDueDate || null,
    dosage: payload.dosage || null,
    administered_by: payload.administeredBy || null,
    notes: payload.notes || null,
    reminder_enabled: payload.reminderEnabled,
  };
}
