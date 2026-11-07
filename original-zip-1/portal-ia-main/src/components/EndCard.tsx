import { useEffect, useRef, type ReactNode } from "react";
import { CircleCheck } from "lucide-react";
import { useReadChapters } from "@/hooks/use-read-chapters";

export function EndCard({ readId, done, next, prev }: { readId: string; done: string; next?: ReactNode; prev?: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const { readIds, mark } = useReadChapters();
  const isRead = readIds.has(readId);
  useEffect(() => {
    const el = ref.current;
    if (!el || isRead) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) mark(readId);
    }, { threshold: 0.6 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [readId, isRead, mark]);

  return (
    <>
      <section ref={ref} aria-labelledby="fim-da-leitura" className="mt-14 rounded-2xl border border-border bg-card p-5 sm:p-6">
        <h2 id="fim-da-leitura" className="flex items-center gap-2 text-small font-semibold">
          <CircleCheck aria-hidden className="size-[18px] text-success" />
          {done}
        </h2>
        {next}
      </section>
      {prev}
    </>
  );
}
