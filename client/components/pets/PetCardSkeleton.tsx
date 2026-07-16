import Skeleton from "@/components/Skeleton";

export default function PetCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-card p-5 shadow-card">
      <div className="flex items-center gap-4">
        <Skeleton className="h-20 w-20 rounded-2xl" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-3.5 w-32" />
        </div>
      </div>
      <Skeleton className="h-3 w-28" />
    </div>
  );
}
