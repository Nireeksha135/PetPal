import { api } from "./api";
import {
  mapMedicine,
  mapMedicineLog,
  toMedicinePayload,
  type Medicine,
  type MedicineLog,
  type MedicineFormPayload,
} from "@/types/medicine";

export const medicineService = {
  async listForPet(petId: string): Promise<Medicine[]> {
    const { data } = await api.get("/medicines", { params: { pet_id: petId } });
    return data.map(mapMedicine);
  },

  async listAll(): Promise<Medicine[]> {
    const { data } = await api.get("/medicines");
    return data.map(mapMedicine);
  },

  async get(medicineId: string): Promise<Medicine> {
    const { data } = await api.get(`/medicines/${medicineId}`);
    return mapMedicine(data);
  },

  async create(payload: MedicineFormPayload): Promise<Medicine> {
    const { data } = await api.post("/medicines", toMedicinePayload(payload));
    return mapMedicine(data);
  },

  async update(
    medicineId: string,
    payload: MedicineFormPayload,
  ): Promise<Medicine> {
    const { data } = await api.patch(
      `/medicines/${medicineId}`,
      toMedicinePayload(payload),
    );
    return mapMedicine(data);
  },

  async delete(medicineId: string): Promise<void> {
    await api.delete(`/medicines/${medicineId}`);
  },

  async listLogs(medicineId: string): Promise<MedicineLog[]> {
    const { data } = await api.get(`/medicines/${medicineId}/logs`);
    return data.map(mapMedicineLog);
  },

  async createLog(
    medicineId: string,
    scheduledFor: string,
    notes?: string,
  ): Promise<MedicineLog> {
    const { data } = await api.post(`/medicines/${medicineId}/logs`, {
      scheduled_for: scheduledFor,
      notes: notes || null,
    });
    return mapMedicineLog(data);
  },

  async markGiven(
    medicineId: string,
    logId: string,
    notes?: string,
  ): Promise<MedicineLog> {
    const { data } = await api.post(
      `/medicines/${medicineId}/logs/${logId}/given`,
      { notes: notes || null },
    );
    return mapMedicineLog(data);
  },

  async markMissed(medicineId: string, logId: string): Promise<MedicineLog> {
    const { data } = await api.post(
      `/medicines/${medicineId}/logs/${logId}/missed`,
    );
    return mapMedicineLog(data);
  },

  async deleteLog(medicineId: string, logId: string): Promise<void> {
    await api.delete(`/medicines/${medicineId}/logs/${logId}`);
  },
};
