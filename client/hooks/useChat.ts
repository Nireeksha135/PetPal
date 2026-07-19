import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { chatService } from "@/services/chatService";

export function useChatSessions() {
  return useQuery({
    queryKey: ["chat-sessions"],
    queryFn: chatService.listSessions,
  });
}

export function useChatSession(sessionId: string | undefined) {
  return useQuery({
    queryKey: ["chat-sessions", sessionId],
    queryFn: () => chatService.getSession(sessionId as string),
    enabled: !!sessionId,
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (petId?: string) => chatService.createSession(petId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-sessions"] });
    },
  });
}

export function useDeleteSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => chatService.deleteSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-sessions"] });
    },
  });
}

export function useSendMessage(sessionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => chatService.sendMessage(sessionId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-sessions", sessionId] });
      queryClient.invalidateQueries({ queryKey: ["chat-sessions"] });
    },
  });
}
