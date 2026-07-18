import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, ShieldPlus } from "lucide-react";
import { useAllDeworming } from "@/hooks/useDeworming";
import { usePets } from "@/hooks/usePets";
import DewormingCard from "@/components/deworming/DewormingCard";
import DewormingCardSkeleton from "@/components/deworming/DewormingCardSkeleton";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import Button from "@/components/Button";
import FormSelect from "@/components/FormSelect";

export default function DewormingList() {
  const { data: records, isLoading, isError, refetch } = useAllDeworming();
  const { data: pets } = usePets();
  const [petFilter, setPetFilter] = useState<string>("all");

  const filtered = records?.filter(
    (r) => petFilter === "all" || r.petId === petFilter,
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
            Deworming Tracker
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Stay on top of deworming treatments and boosters.
          </p>
        </div>
        <Link to="/deworming/new">
          <Button>
            <Plus size={16} />
            Add Record
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
            <DewormingCardSkeleton key={i} />
          ))}
        </div>
      ) : !filtered || filtered.length === 0 ? (
        <EmptyState
          icon={ShieldPlus}
          title="No deworming records yet"
          description="Add a record to start tracking treatments and due dates."
          action={
            <Link to="/deworming/new">
              <Button size="sm">
                <Plus size={14} />
                Add Record
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((record, i) => (
            <DewormingCard key={record.id} record={record} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
