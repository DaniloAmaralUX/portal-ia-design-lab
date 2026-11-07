import { CodeXml, AArrowDown, Lightbulb, ShieldCheck, type LucideIcon } from 'lucide-react';
import { Mark, type MarkSize } from '@/components/Mark';
import type { AreaId } from '@/data/types';

const areaIcon: Record<AreaId, LucideIcon> = {
  produto: Lightbulb,
  qualidade: ShieldCheck,
  engenharia: CodeXml,
  meio: AArrowDown,
};

export function AreaMark({ area, size, className }: { area: AreaId; size?: MarkSize; className?: string }) {
  return <Mark icon={areaIcon[area]} area={area} size={size} className={className} />;
}
