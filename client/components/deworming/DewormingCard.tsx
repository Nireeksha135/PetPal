import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldPlus, Calendar } from "lucide-react";
import type { Deworming } from "@/types/deworming";
import {
  getDueStatus,
  dueStatusStyles,
  dueStatusLabels,
  formatDate,
} from "@/utils/vaccinationMeta";
import { cn } from "@/utils/cn";

interface DewormingCardProps {
  record: Deworming;
  index?: number;
}

export default function DewormingCard({ record, index = 0 }: DewormingCardProps) {
  const status = getDueStatus(record.nextDueDate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
    >
      <Link
        to={`/deworming/${record.id}`}
        className="group flex flex-col gap-3 rounded-2xl bg-card p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elevated"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldPlus size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                {record.productName}
              </h3>
              <span className="text-sm text-muted-foreground">
                Given {formatDate(record.dateGiven)}
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

        {record.nextDueDate && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar size={12} />
            Next due {formatDate(record.nextDueDate)}
          </div>
        )}
      </Link>
    </motion.div>
  );
}
