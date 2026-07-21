import { motion } from "framer-motion";
import { Salad } from "lucide-react";
import type { DietPlan } from "@/types/dietPlan";
import { activityLevelLabels, bodyConditionLabels } from "@/utils/dietMeta";

interface DietPlanResultProps {
  plan: DietPlan;
}

export default function DietPlanResult({ plan }: DietPlanResultProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="rounded-2xl bg-card p-6 shadow-card"
    >
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Salad size={16} />
        </div>
        <h3 className="text-base font-semibold">Recommended Diet Plan</h3>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
          {activityLevelLabels[plan.activityLevel]}
        </span>
        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
          {bodyConditionLabels[plan.bodyCondition]}
        </span>
      </div>

      <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
        {plan.aiRecommendation}
      </p>
    </motion.div>
  );
}
