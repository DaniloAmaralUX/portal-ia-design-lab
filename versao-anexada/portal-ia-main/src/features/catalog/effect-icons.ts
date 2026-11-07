import { Eye, FileCode2, FilePen, GitCommitHorizontal, Globe, KeyRound, SquareTerminal, type LucideIcon } from "lucide-react";
import { EFFECT_KINDS } from "@/data/effect-kinds";
import type { EffectKind } from "@/data/types";

const ICONS: Record<EffectKind, LucideIcon> = {
  credential: KeyRound,
  network: Globe,
  git: GitCommitHorizontal,
  code: FileCode2,
  runs: SquareTerminal,
  writes: FilePen,
  "read-only": Eye,
};

const EFFECT_KINDS_WITH_ICONS = EFFECT_KINDS.map((t) => ({ ...t, icon: ICONS[t.kind] }));

// A skill that also writes or runs something is not read-only, so the read-only mark only shows when it is the only one.
export function kindsOf(declared: EffectKind[]) {
  const present = EFFECT_KINDS_WITH_ICONS.filter((t) => declared.includes(t.kind));
  return present.length > 1 ? present.filter((t) => t.kind !== "read-only") : present;
}
