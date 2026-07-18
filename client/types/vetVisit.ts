export type VisitType =
  | "checkup"
  | "sick_visit"
  | "surgery"
  | "emergency"
  | "dental"
  | "grooming"
  | "follow_up"
  | "other";

export interface VetVisit {
  id: string;
  petId: string;
  ownerId: string;
  visitDate: string;
  visitType: VisitType;
  reason: string;
  vetName: string | null;
  clinicName: string | null;
  diagnosis: string | null;
  treatment: string | null;
  cost: number | null;
  followUpDate: string | null;
  followUpNeeded: boolean;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface VetVisitFormPayload {
  petId: string;
  visitDate: string;
  visitType: VisitType;
  reason: string;
  vetName?: string;
  clinicName?: string;
  diagnosis?: string;
  treatment?: string;
  cost?: number;
  followUpDate?: string;
  followUpNeeded: boolean;
  notes?: string;
}

interface RawVetVisit {
  id: string;
  pet_id: string;
  owner_id: string;
  visit_date: string;
  visit_type: VisitType;
  reason: string;
  vet_name: string | null;
  clinic_name: string | null;
  diagnosis: string | null;
  treatment: string | null;
  cost: number | null;
  follow_up_date: string | null;
  follow_up_needed: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export function mapVetVisit(raw: RawVetVisit): VetVisit {
  return {
    id: raw.id,
    petId: raw.pet_id,
    ownerId: raw.owner_id,
    visitDate: raw.visit_date,
    visitType: raw.visit_type,
    reason: raw.reason,
    vetName: raw.vet_name,
    clinicName: raw.clinic_name,
    diagnosis: raw.diagnosis,
    treatment: raw.treatment,
    cost: raw.cost,
    followUpDate: raw.follow_up_date,
    followUpNeeded: raw.follow_up_needed,
    notes: raw.notes,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

export function toVetVisitPayload(payload: VetVisitFormPayload) {
  return {
    pet_id: payload.petId,
    visit_date: payload.visitDate,
    visit_type: payload.visitType,
    reason: payload.reason,
    vet_name: payload.vetName || null,
    clinic_name: payload.clinicName || null,
    diagnosis: payload.diagnosis || null,
    treatment: payload.treatment || null,
    cost: payload.cost ?? null,
    follow_up_date: payload.followUpDate || null,
    follow_up_needed: payload.followUpNeeded,
    notes: payload.notes || null,
  };
}
