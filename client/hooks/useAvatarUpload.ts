import { useMutation, useQueryClient } from "@tanstack/react-query";
import { petService } from "@/services/petService";
import { getApiErrorMessage } from "@/services/api";

export function useAvatarUpload(petId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => petService.uploadAvatar(petId as string, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pets", petId] });
      queryClient.invalidateQueries({ queryKey: ["pets"] });
    },
    onError: (error) => {
      throw new Error(getApiErrorMessage(error));
    },
  });
}
