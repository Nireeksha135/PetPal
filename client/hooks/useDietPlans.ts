import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dietService } from "@/services/dietService";
import type { DietPlanRequestPayload } from "@/types/dietPlan";

export function useDietPlansForPet(petId: string | undefined) {
  return useQuery({
    queryKey: ["diet-plans", "pet", petId],
    queryFn: () => dietService.listForPet(petId as string),
    enabled: !!petId,
  });
}

export function useAllDietPlans() {
  return useQuery({
    queryKey: ["diet-plans", "all"],
    queryFn: dietService.listAll,
  });
}

export function useDietPlan(planId: string | undefined) {
  return useQuery({
    queryKey: ["diet-plans", planId],
    queryFn: () => dietService.get(planId as string),
    enabled: !!planId,
  });
}

export function useGenerateDietPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DietPlanRequestPayload) => dietService.generate(payload),
    onSuccess: (plan) => {
      queryClient.invalidateQueries({ queryKey: ["diet-plans"] });
      queryClient.invalidateQueries({ queryKey: ["diet-plans", "pet", plan.petId] });
    },
  });
}

export function useDeleteDietPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ planId }: { planId: string; petId: string }) =>
      dietService.delete(planId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["diet-plans"] });
      queryClient.invalidateQueries({ queryKey: ["diet-plans", "pet", variables.petId] });
    },
  });
}
