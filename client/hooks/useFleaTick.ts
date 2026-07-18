import { useQuery } from "@tanstack/react-query";
import { fleaTickService } from "@/services/fleaTickService";

export function useFleaTickForPet(petId: string | undefined) {
  return useQuery({
    queryKey: ["flea-tick", "pet", petId],
    queryFn: () => fleaTickService.listForPet(petId as string),
    enabled: !!petId,
  });
}

export function useAllFleaTick() {
  return useQuery({
    queryKey: ["flea-tick", "all"],
    queryFn: fleaTickService.listAll,
  });
}

export function useFleaTickTreatment(treatmentId: string | undefined) {
  return useQuery({
    queryKey: ["flea-tick", treatmentId],
    queryFn: () => fleaTickService.get(treatmentId as string),
    enabled: !!treatmentId,
  });
}
