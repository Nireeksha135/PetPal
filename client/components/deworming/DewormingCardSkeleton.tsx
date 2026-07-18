import Skeleton from "@/components/Skeleton";

export default function DewormingCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-card p-5 shadow-card">
      <div className="flex items-center gap-3">
        <Skeleton className="h-11 w-11 rounded-xl" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-3 w-36" />
    </div>
  );
}
