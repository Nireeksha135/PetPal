import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Syringe } from "lucide-react";
import { useAllVaccinations } from "@/hooks/useVaccinations";
import { usePets } from "@/hooks/usePets";
import VaccinationCard from "@/components/vaccinations/VaccinationCard";
import VaccinationCardSkeleton from "@/components/vaccinations/VaccinationCardSkeleton";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import Button from "@/components/Button";
import FormSelect from "@/components/FormSelect";

export default function VaccinationList() {
  const { data: vaccinations, isLoading, isError, refetch } = useAllVaccinations();
  const { data: pets } = usePets();
  const [petFilter, setPetFilter] = useState<string>("all");

  const filtered = vaccinations?.filter(
    (v) => petFilter === "all" || v.petId === petFilter,
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
            Vaccination Tracker
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Keep every shot and booster up to date.
          </p>
        </div>
        <Link to="/vaccinations/new">
          <Button>
            <Plus size={16} />
            Add Vaccination
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
            <VaccinationCardSkeleton key={i} />
          ))}
        </div>
      ) : !filtered || filtered.length === 0 ? (
        <EmptyState
          icon={Syringe}
          title="No vaccinations recorded"
          description="Add a vaccination record to start tracking due dates and boosters."
          action={
            <Link to="/vaccinations/new">
              <Button size="sm">
                <Plus size={14} />
                Add Vaccination
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((vaccination, i) => (
            <VaccinationCard
              key={vaccination.id}
              vaccination={vaccination}
              index={i}
            />
          ))}
        </div>
      )}
    </div>
  );
}
