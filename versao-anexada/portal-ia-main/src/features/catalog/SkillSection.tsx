import type { ReactNode } from "react";

export function SkillSection({
  id,
  title,
  children,
  className,
}: {
  id: string;
  title: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-t`} className={className}>
      <h2 id={`${id}-t`} className="mb-4 font-display text-heading font-bold">
        {title}
      </h2>
      {children}
    </section>
  );
}
