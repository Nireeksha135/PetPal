import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fleaTickService } from "@/services/fleaTickService";
import type { FleaTickFormPayload } from "@/types/fleaTick";

interface UseSaveFleaTickOptions {
  treatmentId?: string;
}

function invalidateAll(queryClient: ReturnType<typeof useQueryClient>, petId: string) {
  queryClient.invalidateQueries({ queryKey: ["flea-tick"] });
  queryClient.invalidateQueries({ queryKey: ["flea-tick", "pet", petId] });
  queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
}

export function useSaveFleaTick({ treatmentId }: UseSaveFleaTickOptions = {}) {
  const queryClient = useQueryClient();
  const isEditMode = !!treatmentId;

  return useMutation({
    mutationFn: (payload: FleaTickFormPayload) =>
      isEditMode
        ? fleaTickService.update(treatmentId as string, payload)
        : fleaTickService.create(payload),
    onSuccess: (treatment) => invalidateAll(queryClient, treatment.petId),
  });
}

export function useDeleteFleaTick() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ treatmentId }: { treatmentId: string; petId: string }) =>
      fleaTickService.delete(treatmentId),
    onSuccess: (_data, variables) => invalidateAll(queryClient, variables.petId),
  });
}
