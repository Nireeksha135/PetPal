import type { PetListItem } from "@/types/pet";
import FormSelect from "@/components/FormSelect";
import { forwardRef } from "react";

interface PetSelectProps {
  pets: PetListItem[];
  error?: string;
  label?: string;
  name: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
}

const PetSelect = forwardRef<HTMLSelectElement, PetSelectProps>(
  ({ pets, error, label = "Pet", ...props }, ref) => {
    return (
      <FormSelect
        ref={ref}
        label={label}
        error={error}
        options={pets.map((pet) => ({ value: pet.id, label: pet.name }))}
        {...props}
      />
    );
  },
);

PetSelect.displayName = "PetSelect";
export default PetSelect;
