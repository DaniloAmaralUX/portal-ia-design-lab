import { Fragment } from "react";
import { cn, initials } from "@/lib/utils";

function Avatar({ name }: { name: string }) {
  return (
    <span
      aria-hidden
      className="inline-grid size-6 shrink-0 place-items-center rounded-full bg-muted text-micro font-semibold text-foreground"
    >
      {initials(name)}
    </span>
  );
}

const conjunction = new Intl.ListFormat("pt-BR", { type: "conjunction" });

function Names({ names }: { names: string[] }) {
  return (
    <>
      {conjunction.formatToParts(names).map((part, i) =>
        part.type === "element" ? (
          <span key={i} className="font-medium text-foreground">
            {part.value}
          </span>
        ) : (
          <Fragment key={i}>{part.value}</Fragment>
        ),
      )}
    </>
  );
}

function othersThan(creator: string | null, contributors: string[]) {
  return contributors.filter((n) => n !== creator);
}

export function Byline({
  creator,
  contributors,
  className,
}: {
  creator: string | null;
  contributors: string[];
  className?: string;
}) {
  const others = othersThan(creator, contributors);
  const people = creator ? [creator, ...others] : others;
  if (!people.length) return null;
  return (
    <p className={cn("flex items-start gap-2.5 text-small leading-6 text-muted-foreground", className)}>
      <span className="flex shrink-0 gap-1">
        {people.map((n) => (
          <Avatar key={n} name={n} />
        ))}
      </span>
      <span>
        {creator && (
          <>
            Criada por <Names names={[creator]} />
            {others.length > 0 && ", com contribuições de "}
          </>
        )}
        {!creator && "Com contribuições de "}
        {others.length > 0 && <Names names={others} />}
      </span>
    </p>
  );
}
