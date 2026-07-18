import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Bug } from "lucide-react";
import { useAllFleaTick } from "@/hooks/useFleaTick";
import { usePets } from "@/hooks/usePets";
import FleaTickCard from "@/components/fleaTick/FleaTickCard";
import FleaTickCardSkeleton from "@/components/fleaTick/FleaTickCardSkeleton";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import Button from "@/components/Button";
import FormSelect from "@/components/FormSelect";

export default function FleaTickList() {
  const { data: treatments, isLoading, isError, refetch } = useAllFleaTick();
  const { data: pets } = usePets();
  const [petFilter, setPetFilter] = useState<string>("all");

  const filtered = treatments?.filter(
    (t) => petFilter === "all" || t.petId === petFilter,
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
            Flea & Tick Tracker
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Keep prevention treatments on schedule.
          </p>
        </div>
        <Link to="/flea-tick/new">
          <Button>
            <Plus size={16} />
            Add Treatment
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
            <FleaTickCardSkeleton key={i} />
          ))}
        </div>
      ) : !filtered || filtered.length === 0 ? (
        <EmptyState
          icon={Bug}
          title="No treatments recorded"
          description="Add a flea & tick treatment to start tracking due dates."
          action={
            <Link to="/flea-tick/new">
              <Button size="sm">
                <Plus size={14} />
                Add Treatment
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((treatment, i) => (
            <FleaTickCard key={treatment.id} treatment={treatment} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
