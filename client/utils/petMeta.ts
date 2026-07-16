import type { LucideIcon } from "lucide-react";
import { Dog, Cat, Bird, Rabbit, Fish, Turtle, Rat, PawPrint } from "lucide-react";
import type { PetSpecies } from "@/types/pet";

export const speciesIconMap: Record<PetSpecies, LucideIcon> = {
  dog: Dog,
  cat: Cat,
  bird: Bird,
  rabbit: Rabbit,
  fish: Fish,
  reptile: Turtle,
  rodent: Rat,
  other: PawPrint,
};

export const speciesLabelMap: Record<PetSpecies, string> = {
  dog: "Dog",
  cat: "Cat",
  bird: "Bird",
  rabbit: "Rabbit",
  fish: "Fish",
  reptile: "Reptile",
  rodent: "Rodent",
  other: "Other",
};

export function getSpeciesIcon(species: PetSpecies): LucideIcon {
  return speciesIconMap[species] ?? PawPrint;
}

export function getSpeciesLabel(species: PetSpecies): string {
  return speciesLabelMap[species] ?? "Pet";
}

export function calculateAge(dateOfBirth: string | null): string {
  if (!dateOfBirth) return "Age unknown";

  const dob = new Date(dateOfBirth);
  const now = new Date();

  let years = now.getFullYear() - dob.getFullYear();
  let months = now.getMonth() - dob.getMonth();

  if (now.getDate() < dob.getDate()) {
    months -= 1;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years <= 0 && months <= 0) return "Newborn";
  if (years === 0) return `${months} ${months === 1 ? "month" : "months"} old`;
  if (months === 0) return `${years} ${years === 1 ? "year" : "years"} old`;
  return `${years}y ${months}m old`;
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Unknown";
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
