import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { aiDoctorService } from "@/services/aiDoctorService";

export function useConsultationsForPet(petId: string | undefined) {
  return useQuery({
    queryKey: ["ai-consultations", "pet", petId],
    queryFn: () => aiDoctorService.listForPet(petId as string),
    enabled: !!petId,
  });
}

export function useAllConsultations() {
  return useQuery({
    queryKey: ["ai-consultations", "all"],
    queryFn: aiDoctorService.listAll,
  });
}

export function useConsultation(consultationId: string | undefined) {
  return useQuery({
    queryKey: ["ai-consultations", consultationId],
    queryFn: () => aiDoctorService.get(consultationId as string),
    enabled: !!consultationId,
  });
}

export function useCreateConsultation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: aiDoctorService.consult,
    onSuccess: (consultation) => {
      queryClient.invalidateQueries({ queryKey: ["ai-consultations"] });
      queryClient.invalidateQueries({
        queryKey: ["ai-consultations", "pet", consultation.petId],
      });
    },
  });
}

export function useDeleteConsultation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ consultationId }: { consultationId: string; petId: string }) =>
      aiDoctorService.delete(consultationId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ai-consultations"] });
      queryClient.invalidateQueries({
        queryKey: ["ai-consultations", "pet", variables.petId],
      });
    },
  });
}
