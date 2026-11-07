import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

// Adapted from PaceUI's free marketing-features-4 block:
// https://paceui.com/r/marketing-features-4.json
// The portal supplies its own content, links and Radix-based primitives.
export function FeatureCard({
  icon: Icon,
  label,
  title,
  text,
  children,
}: {
  icon: LucideIcon;
  label: string;
  title: string;
  text: string;
  children: ReactNode;
}) {
  return (
    <Card className="flex h-full flex-col justify-between">
      <div className="flex flex-col gap-3 p-6 pb-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
          <Icon aria-hidden className="size-5" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-caption font-medium text-muted-foreground">{label}</p>
          <h3 className="text-subheading font-semibold">{title}</h3>
          <p className="text-small leading-relaxed text-muted-foreground text-pretty">{text}</p>
        </div>
      </div>
      <div className="flex flex-col items-start gap-2 px-6 pb-6 pt-2">{children}</div>
    </Card>
  );
}
