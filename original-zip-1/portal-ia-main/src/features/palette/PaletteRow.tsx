import type { ReactNode } from "react";

export function PaletteRow({ icon, title, detail, side }: { icon: ReactNode; title: ReactNode; detail?: ReactNode; side?: ReactNode }) {
  return (
    <>
      {icon}
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{title}</p>
        {detail && <p className="truncate text-micro text-muted-foreground">{detail}</p>}
      </div>
      {side && <span className="hidden shrink-0 text-micro text-muted-foreground sm:block">{side}</span>}
    </>
  );
}
