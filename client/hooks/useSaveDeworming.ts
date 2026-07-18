import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dewormingService } from "@/services/dewormingService";
import type { DewormingFormPayload } from "@/types/deworming";

interface UseSaveDewormingOptions {
  recordId?: string;
}

function invalidateAll(queryClient: ReturnType<typeof useQueryClient>, petId: string) {
  queryClient.invalidateQueries({ queryKey: ["deworming"] });
  queryClient.invalidateQueries({ queryKey: ["deworming", "pet", petId] });
  queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
}

export function useSaveDeworming({ recordId }: UseSaveDewormingOptions = {}) {
  const queryClient = useQueryClient();
  const isEditMode = !!recordId;

  return useMutation({
    mutationFn: (payload: DewormingFormPayload) =>
      isEditMode
        ? dewormingService.update(recordId as string, payload)
        : dewormingService.create(payload),
    onSuccess: (record) => invalidateAll(queryClient, record.petId),
  });
}

export function useDeleteDeworming() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ recordId }: { recordId: string; petId: string }) =>
      dewormingService.delete(recordId),
    onSuccess: (_data, variables) => invalidateAll(queryClient, variables.petId),
  });
}
