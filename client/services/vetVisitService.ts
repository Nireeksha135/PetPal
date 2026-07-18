import { api } from "./api";
import {
  mapVetVisit,
  toVetVisitPayload,
  type VetVisit,
  type VetVisitFormPayload,
} from "@/types/vetVisit";

export const vetVisitService = {
  async listForPet(petId: string): Promise<VetVisit[]> {
    const { data } = await api.get("/vet-visits", { params: { pet_id: petId } });
    return data.map(mapVetVisit);
  },

  async listAll(): Promise<VetVisit[]> {
    const { data } = await api.get("/vet-visits");
    return data.map(mapVetVisit);
  },

  async get(visitId: string): Promise<VetVisit> {
    const { data } = await api.get(`/vet-visits/${visitId}`);
    return mapVetVisit(data);
  },

  async create(payload: VetVisitFormPayload): Promise<VetVisit> {
    const { data } = await api.post("/vet-visits", toVetVisitPayload(payload));
    return mapVetVisit(data);
  },

  async update(
    visitId: string,
    payload: VetVisitFormPayload,
  ): Promise<VetVisit> {
    const { data } = await api.patch(
      `/vet-visits/${visitId}`,
      toVetVisitPayload(payload),
    );
    return mapVetVisit(data);
  },

  async delete(visitId: string): Promise<void> {
    await api.delete(`/vet-visits/${visitId}`);
  },
};
