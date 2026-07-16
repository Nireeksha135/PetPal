import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  accent?: "primary" | "warning" | "danger" | "neutral";
  index?: number;
}

const accentStyles: Record<string, string> = {
  primary: "bg-primary/10 text-primary",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  danger: "bg-destructive/10 text-destructive",
  neutral: "bg-muted text-muted-foreground",
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  accent = "primary",
  index = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
      className="flex items-center gap-4 rounded-2xl bg-card p-5 shadow-card"
    >
      <div
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
          accentStyles[accent],
        )}
      >
        <Icon size={20} strokeWidth={2} />
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold tracking-tight">{value}</span>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
    </motion.div>
  );
}
