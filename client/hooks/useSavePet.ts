import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { petService } from "@/services/petService";
import type { PetFormPayload } from "@/types/pet";

interface UseSavePetOptions {
  petId?: string;
}

export function useSavePet({ petId }: UseSavePetOptions = {}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const isEditMode = !!petId;

  const mutation = useMutation({
    mutationFn: (payload: PetFormPayload) =>
      isEditMode
        ? petService.update(petId as string, payload)
        : petService.create(payload),
    onSuccess: (pet) => {
      queryClient.invalidateQueries({ queryKey: ["pets"] });
      queryClient.invalidateQueries({ queryKey: ["pets", pet.id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
      navigate(`/pets/${pet.id}`, { replace: true });
    },
  });

  return { ...mutation, isEditMode };
}
