import { Fragment } from "react";
import type { Guide } from "@/data/guides";

export function GuideFacts({ guide, reading }: { guide: Guide; reading: string | null }) {
  const items = [...(reading ? [{ label: "Leitura", value: reading }] : []), ...guide.facts.filter((f) => f.label !== "Leitura")];
  if (!items.length) return null;
  return (
    <dl className="mt-5 grid gap-x-5 gap-y-1 text-caption sm:grid-cols-[auto_minmax(0,1fr)]">
      {items.map((d) => (
        <Fragment key={d.label}>
          <dt className="font-semibold text-foreground">{d.label}</dt>
          <dd className="text-foreground/85">{d.value}</dd>
        </Fragment>
      ))}
    </dl>
  );
}
