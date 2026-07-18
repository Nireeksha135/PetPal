import { api } from "./api";
import {
  mapDeworming,
  toDewormingPayload,
  type Deworming,
  type DewormingFormPayload,
} from "@/types/deworming";

export const dewormingService = {
  async listForPet(petId: string): Promise<Deworming[]> {
    const { data } = await api.get("/deworming", { params: { pet_id: petId } });
    return data.map(mapDeworming);
  },

  async listAll(): Promise<Deworming[]> {
    const { data } = await api.get("/deworming");
    return data.map(mapDeworming);
  },

  async get(recordId: string): Promise<Deworming> {
    const { data } = await api.get(`/deworming/${recordId}`);
    return mapDeworming(data);
  },

  async create(payload: DewormingFormPayload): Promise<Deworming> {
    const { data } = await api.post("/deworming", toDewormingPayload(payload));
    return mapDeworming(data);
  },

  async update(
    recordId: string,
    payload: DewormingFormPayload,
  ): Promise<Deworming> {
    const { data } = await api.patch(
      `/deworming/${recordId}`,
      toDewormingPayload(payload),
    );
    return mapDeworming(data);
  },

  async delete(recordId: string): Promise<void> {
    await api.delete(`/deworming/${recordId}`);
  },
};
