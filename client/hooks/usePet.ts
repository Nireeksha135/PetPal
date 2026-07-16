import { useQuery } from "@tanstack/react-query";
import { petService } from "@/services/petService";

export function usePet(petId: string | undefined) {
  return useQuery({
    queryKey: ["pets", petId],
    queryFn: () => petService.get(petId as string),
    enabled: !!petId,
  });
}
