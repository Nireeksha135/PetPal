import { useQuery } from "@tanstack/react-query";
import { medicineService } from "@/services/medicineService";

export function useMedicinesForPet(petId: string | undefined) {
  return useQuery({
    queryKey: ["medicines", "pet", petId],
    queryFn: () => medicineService.listForPet(petId as string),
    enabled: !!petId,
  });
}

export function useAllMedicines() {
  return useQuery({
    queryKey: ["medicines", "all"],
    queryFn: medicineService.listAll,
  });
}

export function useMedicine(medicineId: string | undefined) {
  return useQuery({
    queryKey: ["medicines", medicineId],
    queryFn: () => medicineService.get(medicineId as string),
    enabled: !!medicineId,
  });
}
