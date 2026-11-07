import type { ReactNode } from "react";

export type FieldControl = { id: string; "aria-invalid": true | undefined; "aria-describedby": string | undefined };

export function Field({
  id,
  label,
  hint,
  problem,
  optional = false,
  children,
}: {
  id: string;
  label: string;
  hint?: ReactNode;
  problem?: string;
  optional?: boolean;
  children: (control: FieldControl) => ReactNode;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const problemId = problem ? `${id}-problem` : undefined;
  return (
    <div>
      <label htmlFor={id} className="text-small font-semibold text-foreground">
        {label}
        {optional && <span className="font-normal text-muted-foreground"> (opcional)</span>}
      </label>
      {hint && (
        <p id={hintId} className="mt-1 max-w-measure text-caption leading-relaxed text-muted-foreground">
          {hint}
        </p>
      )}
      <div className="mt-2">{children({ id, "aria-invalid": problem ? true : undefined, "aria-describedby": [hintId, problemId].filter(Boolean).join(" ") || undefined })}</div>
      {problem && (
        <p id={problemId} className="mt-1.5 text-caption font-medium text-brand-red-ink">
          {problem}
        </p>
      )}
    </div>
  );
}
