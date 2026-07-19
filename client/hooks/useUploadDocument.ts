import { useMutation, useQueryClient } from "@tanstack/react-query";
import { documentService } from "@/services/documentService";
import type { DocumentUploadPayload, DocumentUpdatePayload } from "@/types/document";

function invalidateAll(queryClient: ReturnType<typeof useQueryClient>, petId: string) {
  queryClient.invalidateQueries({ queryKey: ["documents"] });
  queryClient.invalidateQueries({ queryKey: ["documents", "pet", petId] });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DocumentUploadPayload) => documentService.upload(payload),
    onSuccess: (doc) => invalidateAll(queryClient, doc.petId),
  });
}

export function useUpdateDocument(documentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DocumentUpdatePayload) =>
      documentService.update(documentId, payload),
    onSuccess: (doc) => {
      invalidateAll(queryClient, doc.petId);
      queryClient.invalidateQueries({ queryKey: ["documents", documentId] });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ documentId }: { documentId: string; petId: string }) =>
      documentService.delete(documentId),
    onSuccess: (_data, variables) => invalidateAll(queryClient, variables.petId),
  });
}
