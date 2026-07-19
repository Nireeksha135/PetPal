import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ChevronRight } from "lucide-react";
import type { AIConsultation } from "@/types/aiDoctor";

interface ConsultationHistoryItemProps {
  consultation: AIConsultation;
  index?: number;
}

export default function ConsultationHistoryItem({
  consultation,
  index = 0,
}: ConsultationHistoryItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04, ease: "easeOut" }}
    >
      <Link
        to={`/ai-pet-doctor/${consultation.id}`}
        className="group flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-3 transition-colors hover:bg-muted"
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Sparkles size={14} />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-sm font-medium">
              {consultation.title}
            </span>
            <span className="text-xs text-muted-foreground">
              {new Date(consultation.createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
        <ChevronRight
          size={16}
          className="shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
        />
      </Link>
    </motion.div>
  );
}
