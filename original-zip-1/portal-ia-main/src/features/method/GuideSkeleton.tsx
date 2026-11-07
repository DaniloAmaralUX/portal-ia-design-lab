import { LoadingIndicator } from "@/design-system/blocks/LoadingIndicator";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";

export function GuideSkeleton() {
  return (
    <div aria-busy="true" className={`min-h-[calc(100dvh-4rem)] max-w-3xl`}>
      <div className="mb-6"><LoadingIndicator /></div>
      <Skeleton className="h-3.5 w-40" />
      <Skeleton className="mt-6 h-9 w-3/4" />
      <SkeletonText lines={2} className="mt-4" />
      <SkeletonText lines={8} className="mt-12" />
    </div>
  );
}
