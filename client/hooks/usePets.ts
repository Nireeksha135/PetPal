import { useQuery } from "@tanstack/react-query";
import { petService } from "@/services/petService";

export function usePets() {
  return useQuery({
    queryKey: ["pets"],
    queryFn: petService.list,
  });
}
