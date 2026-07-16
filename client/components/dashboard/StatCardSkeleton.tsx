import Skeleton from "@/components/Skeleton";

export default function StatCardSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-card p-5 shadow-card">
      <Skeleton className="h-11 w-11 shrink-0 rounded-xl" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-6 w-14" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}
