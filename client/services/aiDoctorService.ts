import { api } from "./api";
import { mapAIConsultation, type AIConsultation } from "@/types/aiDoctor";

interface ConsultPayload {
  petId: string;
  symptoms: string;
  image?: File | null;
}

export const aiDoctorService = {
  async listForPet(petId: string): Promise<AIConsultation[]> {
    const { data } = await api.get("/ai-pet-doctor", { params: { pet_id: petId } });
    return data.map(mapAIConsultation);
  },

  async listAll(): Promise<AIConsultation[]> {
    const { data } = await api.get("/ai-pet-doctor");
    return data.map(mapAIConsultation);
  },

  async get(consultationId: string): Promise<AIConsultation> {
    const { data } = await api.get(`/ai-pet-doctor/${consultationId}`);
    return mapAIConsultation(data);
  },

  async consult(payload: ConsultPayload): Promise<AIConsultation> {
    const formData = new FormData();
    formData.append("pet_id", payload.petId);
    formData.append("symptoms", payload.symptoms);
    if (payload.image) formData.append("file", payload.image);

    const { data } = await api.post("/ai-pet-doctor", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return mapAIConsultation(data);
  },

  async delete(consultationId: string): Promise<void> {
    await api.delete(`/ai-pet-doctor/${consultationId}`);
  },
};
