export type MedicineFrequency =
  | "once_daily"
  | "twice_daily"
  | "three_times_daily"
  | "weekly"
  | "as_needed"
  | "custom";

export type MedicineLogStatus = "pending" | "given" | "missed";

export interface Medicine {
  id: string;
  petId: string;
  ownerId: string;
  name: string;
  dosage: string;
  frequency: MedicineFrequency;
  timesPerDay: number;
  startDate: string;
  endDate: string | null;
  instructions: string | null;
  prescribedBy: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MedicineLog {
  id: string;
  medicineId: string;
  scheduledFor: string;
  givenAt: string | null;
  status: MedicineLogStatus;
  notes: string | null;
}

export interface MedicineFormPayload {
  petId: string;
  name: string;
  dosage: string;
  frequency: MedicineFrequency;
  timesPerDay: number;
  startDate: string;
  endDate?: string;
  instructions?: string;
  prescribedBy?: string;
  isActive: boolean;
}

interface RawMedicine {
  id: string;
  pet_id: string;
  owner_id: string;
  name: string;
  dosage: string;
  frequency: MedicineFrequency;
  times_per_day: number;
  start_date: string;
  end_date: string | null;
  instructions: string | null;
  prescribed_by: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface RawMedicineLog {
  id: string;
  medicine_id: string;
  scheduled_for: string;
  given_at: string | null;
  status: MedicineLogStatus;
  notes: string | null;
}

export function mapMedicine(raw: RawMedicine): Medicine {
  return {
    id: raw.id,
    petId: raw.pet_id,
    ownerId: raw.owner_id,
    name: raw.name,
    dosage: raw.dosage,
    frequency: raw.frequency,
    timesPerDay: raw.times_per_day,
    startDate: raw.start_date,
    endDate: raw.end_date,
    instructions: raw.instructions,
    prescribedBy: raw.prescribed_by,
    isActive: raw.is_active,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

export function mapMedicineLog(raw: RawMedicineLog): MedicineLog {
  return {
    id: raw.id,
    medicineId: raw.medicine_id,
    scheduledFor: raw.scheduled_for,
    givenAt: raw.given_at,
    status: raw.status,
    notes: raw.notes,
  };
}

export function toMedicinePayload(payload: MedicineFormPayload) {
  return {
    pet_id: payload.petId,
    name: payload.name,
    dosage: payload.dosage,
    frequency: payload.frequency,
    times_per_day: payload.timesPerDay,
    start_date: payload.startDate,
    end_date: payload.endDate || null,
    instructions: payload.instructions || null,
    prescribed_by: payload.prescribedBy || null,
    is_active: payload.isActive,
  };
}
