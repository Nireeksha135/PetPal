import { useMutation, useQueryClient } from "@tanstack/react-query";
import { vaccinationService } from "@/services/vaccinationService";
import type { VaccinationFormPayload } from "@/types/vaccination";

interface UseSaveVaccinationOptions {
  vaccinationId?: string;
}

function invalidateAll(queryClient: ReturnType<typeof useQueryClient>, petId: string) {
  queryClient.invalidateQueries({ queryKey: ["vaccinations"] });
  queryClient.invalidateQueries({ queryKey: ["vaccinations", "pet", petId] });
  queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
}

export function useSaveVaccination({ vaccinationId }: UseSaveVaccinationOptions = {}) {
  const queryClient = useQueryClient();
  const isEditMode = !!vaccinationId;

  return useMutation({
    mutationFn: (payload: VaccinationFormPayload) =>
      isEditMode
        ? vaccinationService.update(vaccinationId as string, payload)
        : vaccinationService.create(payload),
    onSuccess: (vaccination) => invalidateAll(queryClient, vaccination.petId),
  });
}

export function useDeleteVaccination() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ vaccinationId }: { vaccinationId: string; petId: string }) =>
      vaccinationService.delete(vaccinationId),
    onSuccess: (_data, variables) => invalidateAll(queryClient, variables.petId),
  });
}
