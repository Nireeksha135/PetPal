import { useQuery } from "@tanstack/react-query";
import { vetVisitService } from "@/services/vetVisitService";

export function useVetVisitsForPet(petId: string | undefined) {
  return useQuery({
    queryKey: ["vet-visits", "pet", petId],
    queryFn: () => vetVisitService.listForPet(petId as string),
    enabled: !!petId,
  });
}

export function useAllVetVisits() {
  return useQuery({
    queryKey: ["vet-visits", "all"],
    queryFn: vetVisitService.listAll,
  });
}

export function useVetVisit(visitId: string | undefined) {
  return useQuery({
    queryKey: ["vet-visits", visitId],
    queryFn: () => vetVisitService.get(visitId as string),
    enabled: !!visitId,
  });
}
