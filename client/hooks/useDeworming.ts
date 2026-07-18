import { useQuery } from "@tanstack/react-query";
import { dewormingService } from "@/services/dewormingService";

export function useDewormingForPet(petId: string | undefined) {
  return useQuery({
    queryKey: ["deworming", "pet", petId],
    queryFn: () => dewormingService.listForPet(petId as string),
    enabled: !!petId,
  });
}

export function useAllDeworming() {
  return useQuery({
    queryKey: ["deworming", "all"],
    queryFn: dewormingService.listAll,
  });
}

export function useDewormingRecord(recordId: string | undefined) {
  return useQuery({
    queryKey: ["deworming", recordId],
    queryFn: () => dewormingService.get(recordId as string),
    enabled: !!recordId,
  });
}
