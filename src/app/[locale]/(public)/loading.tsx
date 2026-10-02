import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl space-y-4 px-4 py-12 sm:px-6 lg:px-8" aria-busy="true">
      <Skeleton className="h-10 w-2/3 bg-charcoal-100" />
      <Skeleton className="h-4 w-full bg-charcoal-100" />
      <Skeleton className="h-4 w-full bg-charcoal-100" />
      <Skeleton className="h-4 w-5/6 bg-charcoal-100" />
    </div>
  );
}
