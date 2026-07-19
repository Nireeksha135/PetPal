import { api } from "./api";
import {
  mapMedicalDocument,
  type MedicalDocument,
  type DocumentUploadPayload,
  type DocumentUpdatePayload,
} from "@/types/document";

export const documentService = {
  async listForPet(petId: string): Promise<MedicalDocument[]> {
    const { data } = await api.get("/documents", { params: { pet_id: petId } });
    return data.map(mapMedicalDocument);
  },

  async listAll(): Promise<MedicalDocument[]> {
    const { data } = await api.get("/documents");
    return data.map(mapMedicalDocument);
  },

  async get(documentId: string): Promise<MedicalDocument> {
    const { data } = await api.get(`/documents/${documentId}`);
    return mapMedicalDocument(data);
  },

  async upload(payload: DocumentUploadPayload): Promise<MedicalDocument> {
    const formData = new FormData();
    formData.append("pet_id", payload.petId);
    formData.append("title", payload.title);
    formData.append("category", payload.category);
    if (payload.notes) formData.append("notes", payload.notes);
    formData.append("file", payload.file);

    const { data } = await api.post("/documents", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return mapMedicalDocument(data);
  },

  async update(
    documentId: string,
    payload: DocumentUpdatePayload,
  ): Promise<MedicalDocument> {
    const { data } = await api.patch(`/documents/${documentId}`, payload);
    return mapMedicalDocument(data);
  },

  async delete(documentId: string): Promise<void> {
    await api.delete(`/documents/${documentId}`);
  },
};
