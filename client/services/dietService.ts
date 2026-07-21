import { api } from "./api";
import {
  mapDietPlan,
  toDietPlanPayload,
  type DietPlan,
  type DietPlanRequestPayload,
} from "@/types/dietPlan";

export const dietService = {
  async listForPet(petId: string): Promise<DietPlan[]> {
    const { data } = await api.get("/diet-assistant", { params: { pet_id: petId } });
    return data.map(mapDietPlan);
  },

  async listAll(): Promise<DietPlan[]> {
    const { data } = await api.get("/diet-assistant");
    return data.map(mapDietPlan);
  },

  async get(planId: string): Promise<DietPlan> {
    const { data } = await api.get(`/diet-assistant/${planId}`);
    return mapDietPlan(data);
  },

  async generate(payload: DietPlanRequestPayload): Promise<DietPlan> {
    const { data } = await api.post("/diet-assistant", toDietPlanPayload(payload));
    return mapDietPlan(data);
  },

  async delete(planId: string): Promise<void> {
    await api.delete(`/diet-assistant/${planId}`);
  },
};
