import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Salad, ChevronRight } from "lucide-react";
import type { DietPlan } from "@/types/dietPlan";
import { bodyConditionLabels, formatDate } from "@/utils/dietMeta";

interface DietPlanHistoryItemProps {
  plan: DietPlan;
  index?: number;
}

export default function DietPlanHistoryItem({ plan, index = 0 }: DietPlanHistoryItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04, ease: "easeOut" }}
    >
      <Link
        to={`/diet-assistant/${plan.id}`}
        className="group flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-3 transition-colors hover:bg-muted"
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Salad size={14} />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-sm font-medium">
              {bodyConditionLabels[plan.bodyCondition]} plan
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDate(plan.createdAt)}
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
