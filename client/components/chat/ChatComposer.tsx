import { useState, KeyboardEvent } from "react";
import { Send } from "lucide-react";
import { cn } from "@/utils/cn";

interface ChatComposerProps {
  onSend: (content: string) => void;
  disabled: boolean;
}

export default function ChatComposer({ onSend, disabled }: ChatComposerProps) {
  const [value, setValue] = useState("");

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-2 rounded-2xl border border-border bg-card p-2 shadow-soft">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about nutrition, training, grooming..."
        rows={1}
        maxLength={2000}
        className="max-h-32 flex-1 resize-none bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
      />
      <button
        type="button"
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity",
          (disabled || !value.trim()) && "opacity-40",
        )}
        aria-label="Send message"
      >
        <Send size={16} />
      </button>
    </div>
  );
}
