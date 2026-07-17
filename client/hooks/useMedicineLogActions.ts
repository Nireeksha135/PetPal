import { useMutation, useQueryClient } from "@tanstack/react-query";
import { medicineService } from "@/services/medicineService";

export function useMedicineLogActions(medicineId: string) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["medicines", medicineId, "logs"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
  };

  const markGiven = useMutation({
    mutationFn: ({ logId, notes }: { logId: string; notes?: string }) =>
      medicineService.markGiven(medicineId, logId, notes),
    onSuccess: invalidate,
  });

  const markMissed = useMutation({
    mutationFn: (logId: string) => medicineService.markMissed(medicineId, logId),
    onSuccess: invalidate,
  });

  const createLog = useMutation({
    mutationFn: ({ scheduledFor, notes }: { scheduledFor: string; notes?: string }) =>
      medicineService.createLog(medicineId, scheduledFor, notes),
    onSuccess: invalidate,
  });

  const deleteLog = useMutation({
    mutationFn: (logId: string) => medicineService.deleteLog(medicineId, logId),
    onSuccess: invalidate,
  });

  return { markGiven, markMissed, createLog, deleteLog };
}
