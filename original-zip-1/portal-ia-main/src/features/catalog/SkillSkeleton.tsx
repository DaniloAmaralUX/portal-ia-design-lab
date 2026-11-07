import { useParams } from "@tanstack/react-router";
import { Container } from "@/components/ui/container";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { getSkill } from "@/data/catalog";
import { SkillHeader } from "./SkillHeader";

const screen = "min-h-[calc(100dvh-4rem)]";

function Sidebar() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border p-5">
        <Skeleton className="h-4 w-28" />
        <div className="mt-4 space-y-3.5">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex justify-between gap-4">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-3.5 w-24" />
            </div>
          ))}
        </div>
      </div>
      <Skeleton className="h-40 rounded-2xl" />
    </div>
  );
}

function HeaderSkeleton() {
  return (
    <div className="border-b border-border">
      <Container className="pb-10 pt-8 sm:pt-10">
        <Skeleton className="h-3.5 w-56" />
        <Skeleton className="mt-8 h-10 w-2/3" />
        <Skeleton className="mt-4 h-4 w-72" />
        <Skeleton className="mt-4 h-6 w-80 max-w-full rounded-full" />
        <SkeletonText lines={2} className="mt-5 max-w-2xl" />
        <div className="mt-7 flex gap-3">
          <Skeleton className="h-12 w-32 rounded-full" />
          <Skeleton className="h-12 w-48 rounded-full" />
        </div>
      </Container>
    </div>
  );
}

export function SkillSkeleton() {
  const { skill: slug } = useParams({ strict: false });
  const skill = slug ? getSkill(slug) : undefined;
  return (
    <div aria-busy="true" className={screen}>
      {skill ? <SkillHeader skill={skill} /> : <HeaderSkeleton />}
      <Container className="grid grid-cols-1 gap-12 pt-12 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          <Skeleton className="h-6 w-48" />
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Skeleton className="h-16 rounded-2xl" />
            <Skeleton className="h-16 rounded-2xl" />
          </div>
          <Skeleton className="mt-14 h-6 w-40" />
          <SkeletonText lines={5} className="mt-4" />
        </div>
        <Sidebar />
      </Container>
    </div>
  );
}
