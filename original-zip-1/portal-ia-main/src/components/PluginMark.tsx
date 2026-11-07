import { BookOpenText, ClipboardList, FlaskConical, GitCommitHorizontal, GitPullRequest, Layers, MessageSquareText, Plug, type LucideIcon } from "lucide-react";
import { Mark, type MarkSize } from "@/components/Mark";
import type { AreaId } from "@/data/types";

const pluginIcon: Record<string, LucideIcon> = {
  "pr-review": GitPullRequest,
  "automation-bdd": FlaskConical,
  requirements: ClipboardList,
  "technical-documentation": BookOpenText,
  "azure-helpers": Plug,
  "engineering-practices": GitCommitHorizontal,
  communication: MessageSquareText,
};

export function PluginMark({ plugin, area, size, className }: { plugin: string; area: AreaId; size?: MarkSize; className?: string }) {
  return <Mark icon={pluginIcon[plugin] ?? Layers} area={area} size={size} className={className} />;
}
