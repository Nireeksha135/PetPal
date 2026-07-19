import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { AIConsultation } from "@/types/aiDoctor";

interface AIResponseCardProps {
  consultation: AIConsultation;
}

export default function AIResponseCard({ consultation }: AIResponseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="rounded-2xl bg-card p-6 shadow-card"
    >
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Sparkles size={16} />
        </div>
        <h3 className="text-base font-semibold">AI Pet Doctor's Response</h3>
      </div>

      {consultation.imageUrl && (
        <img
          src={consultation.imageUrl}
          alt="Symptom photo"
          className="mt-4 h-40 w-40 rounded-xl object-cover shadow-soft"
        />
      )}

      <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
        {consultation.aiResponse}
      </p>
    </motion.div>
  );
}
