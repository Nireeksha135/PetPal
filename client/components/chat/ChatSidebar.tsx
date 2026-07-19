import { Link, useNavigate } from "react-router-dom";
import { Plus, MessageCircle, Trash2 } from "lucide-react";
import type { ChatSession } from "@/types/chat";
import { useCreateSession, useDeleteSession } from "@/hooks/useChat";
import Skeleton from "@/components/Skeleton";
import { cn } from "@/utils/cn";

interface ChatSidebarProps {
  sessions: ChatSession[] | undefined;
  isLoading: boolean;
  activeSessionId: string | undefined;
}

export default function ChatSidebar({
  sessions,
  isLoading,
  activeSessionId,
}: ChatSidebarProps) {
  const navigate = useNavigate();
  const createSession = useCreateSession();
  const deleteSession = useDeleteSession();

  const handleNewChat = () => {
    createSession.mutate(undefined, {
      onSuccess: (session) => navigate(`/ask-petpal/${session.id}`),
    });
  };

  const handleDelete = (e: React.MouseEvent, sessionId: string) => {
    e.preventDefault();
    e.stopPropagation();
    deleteSession.mutate(sessionId, {
      onSuccess: () => {
        if (sessionId === activeSessionId) {
          navigate("/ask-petpal");
        }
      },
    });
  };

  return (
    <div className="flex h-full w-full flex-col gap-3 rounded-2xl bg-card p-4 shadow-card lg:w-72">
      <button
        type="button"
        onClick={handleNewChat}
        disabled={createSession.isPending}
        className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-soft transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        <Plus size={16} />
        New Conversation
      </button>

      <div className="flex flex-1 flex-col gap-1 overflow-y-auto scrollbar-none">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-11 w-full" />
          ))
        ) : !sessions || sessions.length === 0 ? (
          <p className="mt-6 px-2 text-center text-xs text-muted-foreground">
            No conversations yet. Start one above.
          </p>
        ) : (
          sessions.map((session) => (
            <Link
              key={session.id}
              to={`/ask-petpal/${session.id}`}
              className={cn(
                "group flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm transition-colors",
                session.id === activeSessionId
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/80 hover:bg-muted",
              )}
            >
              <span className="flex items-center gap-2 truncate">
                <MessageCircle size={14} className="shrink-0" />
                <span className="truncate">{session.title}</span>
              </span>
              <button
                type="button"
                onClick={(e) => handleDelete(e, session.id)}
                className="shrink-0 opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                aria-label="Delete conversation"
              >
                <Trash2 size={13} />
              </button>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
