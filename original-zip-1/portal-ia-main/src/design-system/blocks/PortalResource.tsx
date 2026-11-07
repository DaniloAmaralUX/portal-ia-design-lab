import { ArrowUpRight } from "lucide-react";
import { Card } from "../primitives";
import { portalPaths } from "./portal-paths";
export function PortalResource({ index, compact = false }: { index: number; compact?: boolean }) {
  const item = portalPaths[index % portalPaths.length]!;
  return <Card className={`proto-resource ${compact ? "proto-resource-compact" : ""}`}><a href={item.href}><item.icon aria-hidden size={26} /><span className="proto-resource-detail">{item.detail}</span><h3>{item.title}</h3><p>{item.description}</p><span className="proto-resource-link">Explorar <ArrowUpRight size={16} /></span></a></Card>;
}
