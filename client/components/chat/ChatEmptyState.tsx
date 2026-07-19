import { MessageCircle } from "lucide-react";

const suggestions = [
  "What human foods are toxic to dogs?",
  "How often should I bathe my cat?",
  "My puppy won't stop chewing furniture, help?",
  "What's a good exercise routine for a senior dog?",
];

interface ChatEmptyStateProps {
  onSuggestionClick: (text: string) => void;
}

export default function ChatEmptyState({ onSuggestionClick }: ChatEmptyStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <MessageCircle size={26} />
      </div>
      <div>
        <h3 className="text-base font-semibold">Ask PetPal anything</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Nutrition, training, grooming, behavior — start typing below or try
          a suggestion.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onSuggestionClick(s)}
            className="rounded-xl border border-border px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
