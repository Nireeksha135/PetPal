import { api } from "./api";
import {
  mapChatMessage,
  mapChatSession,
  mapChatSessionWithMessages,
  type ChatSession,
  type ChatSessionWithMessages,
  type ChatMessage,
} from "@/types/chat";

export const chatService = {
  async listSessions(): Promise<ChatSession[]> {
    const { data } = await api.get("/ask-petpal/sessions");
    return data.map(mapChatSession);
  },

  async createSession(petId?: string): Promise<ChatSession> {
    const { data } = await api.post("/ask-petpal/sessions", {
      pet_id: petId ?? null,
    });
    return mapChatSession(data);
  },

  async getSession(sessionId: string): Promise<ChatSessionWithMessages> {
    const { data } = await api.get(`/ask-petpal/sessions/${sessionId}`);
    return mapChatSessionWithMessages(data);
  },

  async deleteSession(sessionId: string): Promise<void> {
    await api.delete(`/ask-petpal/sessions/${sessionId}`);
  },

  async sendMessage(sessionId: string, content: string): Promise<ChatMessage> {
    const { data } = await api.post(
      `/ask-petpal/sessions/${sessionId}/messages`,
      { content },
    );
    return mapChatMessage(data);
  },
};
