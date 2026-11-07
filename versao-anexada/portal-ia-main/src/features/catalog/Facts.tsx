import type { ReactNode } from "react";

// A value that wraps does so evenly (text-pretty), without a last line of one word. On a phone the label goes above the value,
// so a long value takes the whole width, aligned at the start, instead of a narrow column aligned at the right.
export function Facts({ items }: { items: { label: ReactNode; value: ReactNode }[] }) {
  return (
    <dl className="divide-y divide-border">
      {items.map((item, i) => (
        <div
          key={i}
          className="flex flex-col gap-1 py-2.5 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between sm:gap-4 lg:py-1.5 lg:first:pt-0 lg:last:pb-0"
        >
          <dt className="shrink-0 text-caption text-muted-foreground">{item.label}</dt>
          <dd className="min-w-0 text-pretty text-small font-medium sm:text-right">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
