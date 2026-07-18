export interface Vaccination {
  id: string;
  petId: string;
  ownerId: string;
  vaccineName: string;
  dateAdministered: string;
  nextDueDate: string | null;
  administeredBy: string | null;
  clinicName: string | null;
  batchNumber: string | null;
  notes: string | null;
  reminderEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VaccinationFormPayload {
  petId: string;
  vaccineName: string;
  dateAdministered: string;
  nextDueDate?: string;
  administeredBy?: string;
  clinicName?: string;
  batchNumber?: string;
  notes?: string;
  reminderEnabled: boolean;
}

interface RawVaccination {
  id: string;
  pet_id: string;
  owner_id: string;
  vaccine_name: string;
  date_administered: string;
  next_due_date: string | null;
  administered_by: string | null;
  clinic_name: string | null;
  batch_number: string | null;
  notes: string | null;
  reminder_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export function mapVaccination(raw: RawVaccination): Vaccination {
  return {
    id: raw.id,
    petId: raw.pet_id,
    ownerId: raw.owner_id,
    vaccineName: raw.vaccine_name,
    dateAdministered: raw.date_administered,
    nextDueDate: raw.next_due_date,
    administeredBy: raw.administered_by,
    clinicName: raw.clinic_name,
    batchNumber: raw.batch_number,
    notes: raw.notes,
    reminderEnabled: raw.reminder_enabled,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

export function toVaccinationPayload(payload: VaccinationFormPayload) {
  return {
    pet_id: payload.petId,
    vaccine_name: payload.vaccineName,
    date_administered: payload.dateAdministered,
    next_due_date: payload.nextDueDate || null,
    administered_by: payload.administeredBy || null,
    clinic_name: payload.clinicName || null,
    batch_number: payload.batchNumber || null,
    notes: payload.notes || null,
    reminder_enabled: payload.reminderEnabled,
  };
}
