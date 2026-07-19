import { useQuery } from "@tanstack/react-query";
import { documentService } from "@/services/documentService";

export function useDocumentsForPet(petId: string | undefined) {
  return useQuery({
    queryKey: ["documents", "pet", petId],
    queryFn: () => documentService.listForPet(petId as string),
    enabled: !!petId,
  });
}

export function useAllDocuments() {
  return useQuery({
    queryKey: ["documents", "all"],
    queryFn: documentService.listAll,
  });
}

export function useDocument(documentId: string | undefined) {
  return useQuery({
    queryKey: ["documents", documentId],
    queryFn: () => documentService.get(documentId as string),
    enabled: !!documentId,
  });
}
