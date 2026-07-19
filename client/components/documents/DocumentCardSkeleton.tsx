import Skeleton from "@/components/Skeleton";

export default function DocumentCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 overflow-hidden rounded-2xl bg-card shadow-card">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="flex flex-col gap-2 px-4 pb-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}
