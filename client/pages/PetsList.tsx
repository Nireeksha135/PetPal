import { Link } from "react-router-dom";
import { Plus, PawPrint } from "lucide-react";
import { usePets } from "@/hooks/usePets";
import PetCard from "@/components/pets/PetCard";
import PetCardSkeleton from "@/components/pets/PetCardSkeleton";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import Button from "@/components/Button";

export default function PetsList() {
  const { data: pets, isLoading, isError, refetch } = usePets();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Pets</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage profiles for everyone in your household.
          </p>
        </div>
        <Link to="/pets/new">
          <Button>
            <Plus size={16} />
            Add Pet
          </Button>
        </Link>
      </div>

      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <PetCardSkeleton key={i} />
          ))}
        </div>
      ) : !pets || pets.length === 0 ? (
        <EmptyState
          icon={PawPrint}
          title="No pets yet"
          description="Add your first pet to start tracking their health, medicine, and care."
          action={
            <Link to="/pets/new">
              <Button size="sm">
                <Plus size={14} />
                Add Pet
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pets.map((pet, i) => (
            <PetCard key={pet.id} pet={pet} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
