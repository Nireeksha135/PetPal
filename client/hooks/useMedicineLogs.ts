import { useQuery } from "@tanstack/react-query";
import { medicineService } from "@/services/medicineService";

export function useMedicineLogs(medicineId: string | undefined) {
  return useQuery({
    queryKey: ["medicines", medicineId, "logs"],
    queryFn: () => medicineService.listLogs(medicineId as string),
    enabled: !!medicineId,
  });
}
