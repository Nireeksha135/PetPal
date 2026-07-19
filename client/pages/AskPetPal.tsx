import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { MessageCircle } from "lucide-react";
import {
  useChatSessions,
  useChatSession,
  useCreateSession,
  useSendMessage,
} from "@/hooks/useChat";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatBubble from "@/components/chat/ChatBubble";
import TypingIndicator from "@/components/chat/TypingIndicator";
import ChatComposer from "@/components/chat/ChatComposer";
import ChatEmptyState from "@/components/chat/ChatEmptyState";
import Skeleton from "@/components/Skeleton";
import ErrorState from "@/components/ErrorState";
import { getApiErrorMessage } from "@/services/api";
import type { ChatMessage } from "@/types/chat";

export default function AskPetPal() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { data: sessions, isLoading: sessionsLoading } = useChatSessions();
  const {
    data: session,
    isLoading: sessionLoading,
    isError,
    refetch,
  } = useChatSession(sessionId);
  const createSession = useCreateSession();
  const sendMessage = useSendMessage(sessionId ?? "");

  const [optimisticMessages, setOptimisticMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOptimisticMessages([]);
    setError(null);
  }, [sessionId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [session?.messages, optimisticMessages, sendMessage.isPending]);

  const handleSend = (content: string) => {
    setError(null);

    if (!sessionId) {
      createSession.mutate(undefined, {
        onSuccess: (newSession) => {
          navigate(`/ask-petpal/${newSession.id}`);
          setTimeout(() => {
            sendMessageToSession(newSession.id, content);
          }, 50);
        },
      });
      return;
    }

    const optimisticUserMessage: ChatMessage = {
      id: `optimistic-${Date.now()}`,
      sessionId,
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };
    setOptimisticMessages((prev) => [...prev, optimisticUserMessage]);

    sendMessage.mutate(content, {
      onSuccess: () => setOptimisticMessages([]),
      onError: (err) => {
        setError(getApiErrorMessage(err));
        setOptimisticMessages([]);
      },
    });
  };

  const sendMessageToSession = (targetSessionId: string, content: string) => {
    // Fallback path used only right after creating a brand-new session
    const optimisticUserMessage: ChatMessage = {
      id: `optimistic-${Date.now()}`,
      sessionId: targetSessionId,
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };
    setOptimisticMessages((prev) => [...prev, optimisticUserMessage]);
  };

  const allMessages = [...(session?.messages ?? []), ...optimisticMessages];

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4 lg:flex-row">
      <ChatSidebar
        sessions={sessions}
        isLoading={sessionsLoading}
        activeSessionId={sessionId}
      />

      <div className="flex flex-1 flex-col rounded-2xl bg-card shadow-card">
        {!sessionId ? (
          <ChatEmptyState onSuggestionClick={handleSend} />
        ) : isError ? (
          <div className="flex flex-1 items-center justify-center p-6">
            <ErrorState title="Couldn't load conversation" onRetry={() => refetch()} />
          </div>
        ) : sessionLoading ? (
          <div className="flex flex-1 flex-col gap-4 p-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="ml-auto h-12 w-2/3" />
            <Skeleton className="h-12 w-1/2" />
          </div>
        ) : (
          <>
            <div
              ref={scrollRef}
              className="flex flex-1 flex-col gap-4 overflow-y-auto p-6 scrollbar-none"
            >
              {allMessages.length === 0 ? (
                <ChatEmptyState onSuggestionClick={handleSend} />
              ) : (
                allMessages.map((message) => (
                  <ChatBubble key={message.id} message={message} />
                ))
              )}
              {sendMessage.isPending && <TypingIndicator />}
            </div>

            {error && (
              <div className="mx-6 mb-2 rounded-xl bg-destructive/10 px-4 py-2 text-xs text-destructive">
                {error}
              </div>
            )}

            <div className="border-t border-border p-4">
              <ChatComposer
                onSend={handleSend}
                disabled={sendMessage.isPending || createSession.isPending}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
