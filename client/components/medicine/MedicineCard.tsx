import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Pill, Calendar, User as UserIcon } from "lucide-react";
import type { Medicine } from "@/types/medicine";
import { frequencyLabels, isMedicineExpired } from "@/utils/medicineMeta";
import { cn } from "@/utils/cn";

interface MedicineCardProps {
  medicine: Medicine;
  index?: number;
}

export default function MedicineCard({ medicine, index = 0 }: MedicineCardProps) {
  const expired = isMedicineExpired(medicine.endDate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
    >
      <Link
        to={`/medicine/${medicine.id}`}
        className="group flex flex-col gap-3 rounded-2xl bg-card p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elevated"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Pill size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{medicine.name}</h3>
              <span className="text-sm text-muted-foreground">
                {medicine.dosage}
              </span>
            </div>
          </div>
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-medium",
              !medicine.isActive || expired
                ? "bg-muted text-muted-foreground"
                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
            )}
          >
            {!medicine.isActive ? "Inactive" : expired ? "Completed" : "Active"}
          </span>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {frequencyLabels[medicine.frequency]}
          </span>
          {medicine.prescribedBy && (
            <span className="flex items-center gap-1">
              <UserIcon size={12} />
              {medicine.prescribedBy}
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
