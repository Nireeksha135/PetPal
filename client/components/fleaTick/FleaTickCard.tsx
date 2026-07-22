import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bug, Calendar } from "lucide-react";
import type { FleaTickTreatment } from "@/types/fleaTick";
import {
  getDueStatus,
  dueStatusStyles,
  dueStatusLabels,
  formatDate,
} from "@/utils/vaccinationMeta";
import { treatmentTypeLabels } from "@/utils/fleaTickMeta";
import { cn } from "@/utils/cn";

interface FleaTickCardProps {
  treatment: FleaTickTreatment;
  index?: number;
}

export default function FleaTickCard({ treatment, index = 0 }: FleaTickCardProps) {
  const status = getDueStatus(treatment.nextDueDate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
    >
      <Link
        to={`/flea-tick/${treatment.id}`}
        className="group flex flex-col gap-3 rounded-2xl bg-card p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elevated"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Bug size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                {treatment.productName}
              </h3>
              <span className="text-sm text-muted-foreground">
                {treatmentTypeLabels[treatment.treatmentType]} · Applied{" "}
                {formatDate(treatment.dateApplied)}
              </span>
            </div>
          </div>
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-medium",
              dueStatusStyles[status],
            )}
          >
            {dueStatusLabels[status]}
          </span>
        </div>

        {treatment.nextDueDate && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar size={12} />
            Next due {formatDate(treatment.nextDueDate)}
          </div>
        )}
      </Link>
    </motion.div>
  );
}
