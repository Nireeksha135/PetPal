import { api } from "./api";
import {
  mapVaccination,
  toVaccinationPayload,
  type Vaccination,
  type VaccinationFormPayload,
} from "@/types/vaccination";

export const vaccinationService = {
  async listForPet(petId: string): Promise<Vaccination[]> {
    const { data } = await api.get("/vaccinations", { params: { pet_id: petId } });
    return data.map(mapVaccination);
  },

  async listAll(): Promise<Vaccination[]> {
    const { data } = await api.get("/vaccinations");
    return data.map(mapVaccination);
  },

  async get(vaccinationId: string): Promise<Vaccination> {
    const { data } = await api.get(`/vaccinations/${vaccinationId}`);
    return mapVaccination(data);
  },

  async create(payload: VaccinationFormPayload): Promise<Vaccination> {
    const { data } = await api.post(
      "/vaccinations",
      toVaccinationPayload(payload),
    );
    return mapVaccination(data);
  },

  async update(
    vaccinationId: string,
    payload: VaccinationFormPayload,
  ): Promise<Vaccination> {
    const { data } = await api.patch(
      `/vaccinations/${vaccinationId}`,
      toVaccinationPayload(payload),
    );
    return mapVaccination(data);
  },

  async delete(vaccinationId: string): Promise<void> {
    await api.delete(`/vaccinations/${vaccinationId}`);
  },
};
