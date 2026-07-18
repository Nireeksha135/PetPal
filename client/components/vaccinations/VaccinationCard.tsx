import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Syringe, Calendar, Building2 } from "lucide-react";
import type { Vaccination } from "@/types/vaccination";
import {
  getDueStatus,
  dueStatusStyles,
  dueStatusLabels,
  formatDate,
} from "@/utils/vaccinationMeta";
import { cn } from "@/utils/cn";

interface VaccinationCardProps {
  vaccination: Vaccination;
  index?: number;
}

export default function VaccinationCard({
  vaccination,
  index = 0,
}: VaccinationCardProps) {
  const status = getDueStatus(vaccination.nextDueDate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
    >
      <Link
        to={`/vaccinations/${vaccination.id}`}
        className="group flex flex-col gap-3 rounded-2xl bg-card p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elevated"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Syringe size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                {vaccination.vaccineName}
              </h3>
              <span className="text-sm text-muted-foreground">
                Given {formatDate(vaccination.dateAdministered)}
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

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {vaccination.nextDueDate && (
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              Next due {formatDate(vaccination.nextDueDate)}
            </span>
          )}
          {vaccination.clinicName && (
            <span className="flex items-center gap-1">
              <Building2 size={12} />
              {vaccination.clinicName}
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
