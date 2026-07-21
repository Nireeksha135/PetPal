export type ActivityLevel = "low" | "moderate" | "high";
export type BodyCondition = "underweight" | "ideal" | "overweight" | "unknown";

export interface DietPlan {
  id: string;
  petId: string;
  ownerId: string;
  activityLevel: ActivityLevel;
  bodyCondition: BodyCondition;
  currentWeightKg: number | null;
  goalWeightKg: number | null;
  allergies: string | null;
  healthConditions: string | null;
  additionalNotes: string | null;
  aiRecommendation: string;
  createdAt: string;
}

export interface DietPlanRequestPayload {
  petId: string;
  activityLevel: ActivityLevel;
  bodyCondition: BodyCondition;
  currentWeightKg?: number;
  goalWeightKg?: number;
  allergies?: string;
  healthConditions?: string;
  additionalNotes?: string;
}

interface RawDietPlan {
  id: string;
  pet_id: string;
  owner_id: string;
  activity_level: ActivityLevel;
  body_condition: BodyCondition;
  current_weight_kg: number | null;
  goal_weight_kg: number | null;
  allergies: string | null;
  health_conditions: string | null;
  additional_notes: string | null;
  ai_recommendation: string;
  created_at: string;
}

export function mapDietPlan(raw: RawDietPlan): DietPlan {
  return {
    id: raw.id,
    petId: raw.pet_id,
    ownerId: raw.owner_id,
    activityLevel: raw.activity_level,
    bodyCondition: raw.body_condition,
    currentWeightKg: raw.current_weight_kg,
    goalWeightKg: raw.goal_weight_kg,
    allergies: raw.allergies,
    healthConditions: raw.health_conditions,
    additionalNotes: raw.additional_notes,
    aiRecommendation: raw.ai_recommendation,
    createdAt: raw.created_at,
  };
}

export function toDietPlanPayload(payload: DietPlanRequestPayload) {
  return {
    pet_id: payload.petId,
    activity_level: payload.activityLevel,
    body_condition: payload.bodyCondition,
    current_weight_kg: payload.currentWeightKg ?? null,
    goal_weight_kg: payload.goalWeightKg ?? null,
    allergies: payload.allergies || null,
    health_conditions: payload.healthConditions || null,
    additional_notes: payload.additionalNotes || null,
  };
}
