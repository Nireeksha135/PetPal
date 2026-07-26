import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useTilt } from "@/hooks/useTilt";
import { cn } from "@/utils/cn";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  accent?: "primary" | "sage" | "warning" | "danger" | "neutral";
  index?: number;
}

const accentStyles: Record<string, string> = {
  primary: "bg-primary/12 text-primary",
  sage: "bg-accent text-accent-foreground",
  warning: "bg-amber-500/12 text-amber-600 dark:text-amber-400",
  danger: "bg-destructive/12 text-destructive",
  neutral: "bg-muted text-muted-foreground",
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  accent = "primary",
  index = 0,
}: StatCardProps) {
  const { ref, rotateX, rotateY, lift, handlers } = useTilt(7);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handlers.onMouseMove}
      onMouseEnter={handlers.onMouseEnter}
      onMouseLeave={handlers.onMouseLeave}
      style={{
        rotateX,
        rotateY,
        y: lift.get ? undefined : 0,
        transformPerspective: 900,
      }}
      whileHover={{ y: -6, scale: 1.02 }}
      className={cn(
        "bg-card rim-light flex items-center gap-4 rounded-2xl p-5",
        "will-change-transform",
      )}
    >
      <div
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
          accentStyles[accent],
        )}
      >
        <Icon size={19} strokeWidth={1.75} />
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold tracking-tight font-display">
          {value}
        </span>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
    </motion.div>
  );
}
