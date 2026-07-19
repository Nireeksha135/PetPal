export interface ChatMessage {
  id: string;
  sessionId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface ChatSession {
  id: string;
  ownerId: string;
  petId: string | null;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatSessionWithMessages extends ChatSession {
  messages: ChatMessage[];
}

interface RawChatMessage {
  id: string;
  session_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

interface RawChatSession {
  id: string;
  owner_id: string;
  pet_id: string | null;
  title: string;
  created_at: string;
  updated_at: string;
}

interface RawChatSessionWithMessages extends RawChatSession {
  messages: RawChatMessage[];
}

export function mapChatMessage(raw: RawChatMessage): ChatMessage {
  return {
    id: raw.id,
    sessionId: raw.session_id,
    role: raw.role,
    content: raw.content,
    createdAt: raw.created_at,
  };
}

export function mapChatSession(raw: RawChatSession): ChatSession {
  return {
    id: raw.id,
    ownerId: raw.owner_id,
    petId: raw.pet_id,
    title: raw.title,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

export function mapChatSessionWithMessages(
  raw: RawChatSessionWithMessages,
): ChatSessionWithMessages {
  return {
    ...mapChatSession(raw),
    messages: raw.messages.map(mapChatMessage),
  };
}
