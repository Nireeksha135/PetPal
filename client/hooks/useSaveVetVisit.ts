import { useMutation, useQueryClient } from "@tanstack/react-query";
import { vetVisitService } from "@/services/vetVisitService";
import type { VetVisitFormPayload } from "@/types/vetVisit";

interface UseSaveVetVisitOptions {
  visitId?: string;
}

function invalidateAll(queryClient: ReturnType<typeof useQueryClient>, petId: string) {
  queryClient.invalidateQueries({ queryKey: ["vet-visits"] });
  queryClient.invalidateQueries({ queryKey: ["vet-visits", "pet", petId] });
  queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
}

export function useSaveVetVisit({ visitId }: UseSaveVetVisitOptions = {}) {
  const queryClient = useQueryClient();
  const isEditMode = !!visitId;

  return useMutation({
    mutationFn: (payload: VetVisitFormPayload) =>
      isEditMode
        ? vetVisitService.update(visitId as string, payload)
        : vetVisitService.create(payload),
    onSuccess: (visit) => invalidateAll(queryClient, visit.petId),
  });
}

export function useDeleteVetVisit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ visitId }: { visitId: string; petId: string }) =>
      vetVisitService.delete(visitId),
    onSuccess: (_data, variables) => invalidateAll(queryClient, variables.petId),
  });
}
