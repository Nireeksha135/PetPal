import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Stethoscope, Calendar, Building2, DollarSign } from "lucide-react";
import type { VetVisit } from "@/types/vetVisit";
import {
  visitTypeLabels,
  visitTypeStyles,
  formatDate,
  formatCost,
  isUpcomingVisit,
} from "@/utils/vetVisitMeta";
import { cn } from "@/utils/cn";

interface VetVisitCardProps {
  visit: VetVisit;
  index?: number;
}

export default function VetVisitCard({ visit, index = 0 }: VetVisitCardProps) {
  const upcoming = isUpcomingVisit(visit.visitDate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
    >
      <Link
        to={`/vet-visits/${visit.id}`}
        className="group flex flex-col gap-3 rounded-2xl bg-card p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elevated"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Stethoscope size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{visit.reason}</h3>
              <span className="text-sm text-muted-foreground">
                {formatDate(visit.visitDate)}
                {upcoming ? " · Upcoming" : ""}
              </span>
            </div>
          </div>
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-medium",
              visitTypeStyles[visit.visitType],
            )}
          >
            {visitTypeLabels[visit.visitType]}
          </span>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {visit.clinicName && (
            <span className="flex items-center gap-1">
              <Building2 size={12} />
              {visit.clinicName}
            </span>
          )}
          {visit.cost !== null && (
            <span className="flex items-center gap-1">
              <DollarSign size={12} />
              {formatCost(visit.cost)}
            </span>
          )}
          {visit.followUpNeeded && visit.followUpDate && (
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              Follow-up {formatDate(visit.followUpDate)}
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
