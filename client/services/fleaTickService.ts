import { api } from "./api";
import {
  mapFleaTickTreatment,
  toFleaTickPayload,
  type FleaTickTreatment,
  type FleaTickFormPayload,
} from "@/types/fleaTick";

export const fleaTickService = {
  async listForPet(petId: string): Promise<FleaTickTreatment[]> {
    const { data } = await api.get("/flea-tick", { params: { pet_id: petId } });
    return data.map(mapFleaTickTreatment);
  },

  async listAll(): Promise<FleaTickTreatment[]> {
    const { data } = await api.get("/flea-tick");
    return data.map(mapFleaTickTreatment);
  },

  async get(treatmentId: string): Promise<FleaTickTreatment> {
    const { data } = await api.get(`/flea-tick/${treatmentId}`);
    return mapFleaTickTreatment(data);
  },

  async create(payload: FleaTickFormPayload): Promise<FleaTickTreatment> {
    const { data } = await api.post("/flea-tick", toFleaTickPayload(payload));
    return mapFleaTickTreatment(data);
  },

  async update(
    treatmentId: string,
    payload: FleaTickFormPayload,
  ): Promise<FleaTickTreatment> {
    const { data } = await api.patch(
      `/flea-tick/${treatmentId}`,
      toFleaTickPayload(payload),
    );
    return mapFleaTickTreatment(data);
  },

  async delete(treatmentId: string): Promise<void> {
    await api.delete(`/flea-tick/${treatmentId}`);
  },
};
