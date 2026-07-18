import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Stethoscope } from "lucide-react";
import { useAllVetVisits } from "@/hooks/useVetVisits";
import { usePets } from "@/hooks/usePets";
import VetVisitCard from "@/components/vetVisits/VetVisitCard";
import VetVisitCardSkeleton from "@/components/vetVisits/VetVisitCardSkeleton";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import Button from "@/components/Button";
import FormSelect from "@/components/FormSelect";

export default function VetVisitList() {
  const { data: visits, isLoading, isError, refetch } = useAllVetVisits();
  const { data: pets } = usePets();
  const [petFilter, setPetFilter] = useState<string>("all");

  const filtered = visits?.filter(
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
            Vet Visit Manager
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track every checkup, procedure, and follow-up.
          </p>
        </div>
        <Link to="/vet-visits/new">
          <Button>
            <Plus size={16} />
            Add Visit
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
            <VetVisitCardSkeleton key={i} />
          ))}
        </div>
      ) : !filtered || filtered.length === 0 ? (
        <EmptyState
          icon={Stethoscope}
          title="No vet visits recorded"
          description="Add a visit to start building your pet's medical history."
          action={
            <Link to="/vet-visits/new">
              <Button size="sm">
                <Plus size={14} />
                Add Visit
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((visit, i) => (
            <VetVisitCard key={visit.id} visit={visit} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
