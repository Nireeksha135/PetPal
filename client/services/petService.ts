import { api } from "./api";
import {
  mapPet,
  mapPetListItem,
  toPetCreatePayload,
  type Pet,
  type PetListItem,
  type PetFormPayload,
} from "@/types/pet";

export const petService = {
  async list(): Promise<PetListItem[]> {
    const { data } = await api.get("/pets");
    return data.map(mapPetListItem);
  },

  async get(petId: string): Promise<Pet> {
    const { data } = await api.get(`/pets/${petId}`);
    return mapPet(data);
  },

  async create(payload: PetFormPayload): Promise<Pet> {
    const { data } = await api.post("/pets", toPetCreatePayload(payload));
    return mapPet(data);
  },

  async update(petId: string, payload: PetFormPayload): Promise<Pet> {
    const { data } = await api.patch(
      `/pets/${petId}`,
      toPetCreatePayload(payload),
    );
    return mapPet(data);
  },

  async uploadAvatar(petId: string, file: File): Promise<Pet> {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await api.post(`/pets/${petId}/avatar`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return mapPet(data);
  },

  async delete(petId: string): Promise<void> {
    await api.delete(`/pets/${petId}`);
  },
};
