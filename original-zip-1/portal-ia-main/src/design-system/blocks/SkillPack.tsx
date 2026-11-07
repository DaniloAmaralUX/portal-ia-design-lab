import { Code2, Check } from "lucide-react";
import { portalPaths } from "./portal-paths";
export function SkillPack({ kind = 0, small = false }: { kind?: number; small?: boolean }) {
  const item = portalPaths[kind % portalPaths.length]!;
  return <div role="img" aria-label={`PrÃ©via ${item.title}`} className={`proto-pack proto-pack-${kind} ${small ? "proto-pack-small" : ""}`}>
    <div aria-hidden="true" className="proto-pack-binding"><span>PITANG</span><Code2 size={15} /></div>
    <div aria-hidden="true" className="proto-pack-cover"><div className="proto-pack-top"><span>portal ia</span><span>â†—</span></div><item.icon strokeWidth={1} className="proto-pack-icon" /><strong>{item.title}</strong><span className="proto-pack-sub">{item.detail}</span><div className="proto-pack-bottom"><span>Conhecimento compartilhado.</span><Check size={14} /></div></div>
  </div>;
}

