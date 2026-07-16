export type PetSpecies =
  | "dog"
  | "cat"
  | "bird"
  | "rabbit"
  | "fish"
  | "reptile"
  | "rodent"
  | "other";

export type PetGender = "male" | "female" | "unknown";

export interface Pet {
  id: string;
  ownerId: string;
  name: string;
  species: PetSpecies;
  breed: string | null;
  gender: PetGender;
  dateOfBirth: string | null;
  weightKg: number | null;
  color: string | null;
  microchipId: string | null;
  isNeutered: boolean;
  notes: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PetListItem {
  id: string;
  name: string;
  species: PetSpecies;
  breed: string | null;
  dateOfBirth: string | null;
  avatarUrl: string | null;
}

interface RawPet {
  id: string;
  owner_id: string;
  name: string;
  species: PetSpecies;
  breed: string | null;
  gender: PetGender;
  date_of_birth: string | null;
  weight_kg: number | null;
  color: string | null;
  microchip_id: string | null;
  is_neutered: boolean;
  notes: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface RawPetListItem {
  id: string;
  name: string;
  species: PetSpecies;
  breed: string | null;
  date_of_birth: string | null;
  avatar_url: string | null;
}

export function mapPet(raw: RawPet): Pet {
  return {
    id: raw.id,
    ownerId: raw.owner_id,
    name: raw.name,
    species: raw.species,
    breed: raw.breed,
    gender: raw.gender,
    dateOfBirth: raw.date_of_birth,
    weightKg: raw.weight_kg,
    color: raw.color,
    microchipId: raw.microchip_id,
    isNeutered: raw.is_neutered,
    notes: raw.notes,
    avatarUrl: raw.avatar_url,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

export function mapPetListItem(raw: RawPetListItem): PetListItem {
  return {
    id: raw.id,
    name: raw.name,
    species: raw.species,
    breed: raw.breed,
    dateOfBirth: raw.date_of_birth,
    avatarUrl: raw.avatar_url,
  };
}
