import { api } from "./api";
import { mapPet, mapPetListItem, type Pet, type PetListItem } from "@/types/pet";

export const petService = {
  async list(): Promise<PetListItem[]> {
    const { data } = await api.get("/pets");
    return data.map(mapPetListItem);
  },

  async get(petId: string): Promise<Pet> {
    const { data } = await api.get(`/pets/${petId}`);
    return mapPet(data);
  },

  async delete(petId: string): Promise<void> {
    await api.delete(`/pets/${petId}`);
  },
};
