import { useQuery } from "@tanstack/react-query";
import { vaccinationService } from "@/services/vaccinationService";

export function useVaccinationsForPet(petId: string | undefined) {
  return useQuery({
    queryKey: ["vaccinations", "pet", petId],
    queryFn: () => vaccinationService.listForPet(petId as string),
    enabled: !!petId,
  });
}

export function useAllVaccinations() {
  return useQuery({
    queryKey: ["vaccinations", "all"],
    queryFn: vaccinationService.listAll,
  });
}

export function useVaccination(vaccinationId: string | undefined) {
  return useQuery({
    queryKey: ["vaccinations", vaccinationId],
    queryFn: () => vaccinationService.get(vaccinationId as string),
    enabled: !!vaccinationId,
  });
}
