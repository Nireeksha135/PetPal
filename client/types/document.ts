export type DocumentCategory =
  | "lab_result"
  | "xray"
  | "prescription"
  | "insurance"
  | "vaccination_certificate"
  | "invoice"
  | "other";

export interface MedicalDocument {
  id: string;
  petId: string;
  ownerId: string;
  title: string;
  category: DocumentCategory;
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSizeBytes: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentUploadPayload {
  petId: string;
  title: string;
  category: DocumentCategory;
  notes?: string;
  file: File;
}

export interface DocumentUpdatePayload {
  title?: string;
  category?: DocumentCategory;
  notes?: string;
}

interface RawMedicalDocument {
  id: string;
  pet_id: string;
  owner_id: string;
  title: string;
  category: DocumentCategory;
  file_url: string;
  file_name: string;
  file_type: string;
  file_size_bytes: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export function mapMedicalDocument(raw: RawMedicalDocument): MedicalDocument {
  return {
    id: raw.id,
    petId: raw.pet_id,
    ownerId: raw.owner_id,
    title: raw.title,
    category: raw.category,
    fileUrl: raw.file_url,
    fileName: raw.file_name,
    fileType: raw.file_type,
    fileSizeBytes: raw.file_size_bytes,
    notes: raw.notes,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}
