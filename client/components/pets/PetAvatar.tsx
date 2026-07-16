import type { PetSpecies } from "@/types/pet";
import { getSpeciesIcon } from "@/utils/petMeta";
import { cn } from "@/utils/cn";

interface PetAvatarProps {
  name: string;
  species: PetSpecies;
  avatarUrl: string | null;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeMap: Record<string, string> = {
  sm: "h-10 w-10",
  md: "h-14 w-14",
  lg: "h-20 w-20",
  xl: "h-28 w-28",
};

const iconSizeMap: Record<string, number> = {
  sm: 16,
  md: 22,
  lg: 30,
  xl: 42,
};

export default function PetAvatar({
  name,
  species,
  avatarUrl,
  size = "md",
}: PetAvatarProps) {
  const Icon = getSpeciesIcon(species);

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={cn(
          "rounded-2xl object-cover shadow-soft",
          sizeMap[size],
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-soft",
        sizeMap[size],
      )}
    >
      <Icon size={iconSizeMap[size]} strokeWidth={1.75} />
    </div>
  );
}
