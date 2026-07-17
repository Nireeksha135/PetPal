import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pill } from "lucide-react";
import { useAllMedicines } from "@/hooks/useMedicines";
import { usePets } from "@/hooks/usePets";
import MedicineCard from "@/components/medicine/MedicineCard";
import MedicineCardSkeleton from "@/components/medicine/MedicineCardSkeleton";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import Button from "@/components/Button";
import FormSelect from "@/components/FormSelect";

export default function MedicineList() {
  const { data: medicines, isLoading, isError, refetch } = useAllMedicines();
  const { data: pets } = usePets();
  const [petFilter, setPetFilter] = useState<string>("all");

  const filtered = medicines?.filter(
    (m) => petFilter === "all" || m.petId === petFilter,
  );

  const petOptions = [
    { value: "all", label: "All Pets" },
    ...(pets ?? []).map((p) => ({ value: p.id, label: p.name })),
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Medicine Tracker
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage prescriptions and track every dose.
          </p>
        </div>
        <Link to="/medicine/new">
          <Button>
            <Plus size={16} />
            Add Medicine
          </Button>
        </Link>
      </div>

      {(pets?.length ?? 0) > 1 && (
        <div className="max-w-xs">
          <FormSelect
            label="Filter by pet"
            options={petOptions}
            value={petFilter}
            onChange={(e) => setPetFilter(e.target.value)}
          />
        </div>
      )}

      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <MedicineCardSkeleton key={i} />
          ))}
        </div>
      ) : !filtered || filtered.length === 0 ? (
        <EmptyState
          icon={Pill}
          title="No medicines yet"
          description="Add a prescription to start tracking doses and reminders."
          action={
            <Link to="/medicine/new">
              <Button size="sm">
                <Plus size={14} />
                Add Medicine
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((medicine, i) => (
            <MedicineCard key={medicine.id} medicine={medicine} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
