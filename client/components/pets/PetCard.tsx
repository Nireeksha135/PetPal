import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Cake } from "lucide-react";
import type { PetListItem } from "@/types/pet";
import PetAvatar from "./PetAvatar";
import { getSpeciesLabel, calculateAge } from "@/utils/petMeta";

interface PetCardProps {
  pet: PetListItem;
  index?: number;
}

export default function PetCard({ pet, index = 0 }: PetCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
    >
      <Link
        to={`/pets/${pet.id}`}
        className="group flex flex-col gap-4 rounded-2xl bg-card p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elevated"
      >
        <div className="flex items-center gap-4">
          <PetAvatar
            name={pet.name}
            species={pet.species}
            avatarUrl={pet.avatarUrl}
            size="lg"
          />
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold tracking-tight">
              {pet.name}
            </h3>
            <span className="text-sm text-muted-foreground">
              {getSpeciesLabel(pet.species)}
              {pet.breed ? ` · ${pet.breed}` : ""}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Cake size={13} />
          {calculateAge(pet.dateOfBirth)}
        </div>
      </Link>
    </motion.div>
  );
}
