import { useMutation, useQueryClient } from "@tanstack/react-query";
import { medicineService } from "@/services/medicineService";
import type { MedicineFormPayload } from "@/types/medicine";

interface UseSaveMedicineOptions {
  medicineId?: string;
}

function invalidateAll(queryClient: ReturnType<typeof useQueryClient>, petId: string) {
  queryClient.invalidateQueries({ queryKey: ["medicines"] });
  queryClient.invalidateQueries({ queryKey: ["medicines", "pet", petId] });
  queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
}

export function useSaveMedicine({ medicineId }: UseSaveMedicineOptions = {}) {
  const queryClient = useQueryClient();
  const isEditMode = !!medicineId;

  return useMutation({
    mutationFn: (payload: MedicineFormPayload) =>
      isEditMode
        ? medicineService.update(medicineId as string, payload)
        : medicineService.create(payload),
    onSuccess: (medicine) => invalidateAll(queryClient, medicine.petId),
  });
}

export function useDeleteMedicine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ medicineId }: { medicineId: string; petId: string }) =>
      medicineService.delete(medicineId),
    onSuccess: (_data, variables) => invalidateAll(queryClient, variables.petId),
  });
}
