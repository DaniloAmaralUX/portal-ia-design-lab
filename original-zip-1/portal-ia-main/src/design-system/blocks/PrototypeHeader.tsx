import { useState } from "react";
import { Search, Menu, ArrowUpRight } from "lucide-react";
import { Button, Sheet } from "../primitives";
import { PortalBrand } from "./PortalBrand";
import { PortalSearch } from "./PortalSearch";
import { portalPaths } from "./portal-paths";
export function PrototypeHeader({ variant }: { variant: "craft" | "chanhdai" | "nove" }) {
  const [open, setOpen] = useState(false);
  return <>
    <header className={`proto-header proto-header-${variant}`}>
      <PortalBrand compact={variant !== "craft"} />
      <nav aria-label="Navegação principal" className="proto-desktop-nav">{portalPaths.map(item => <a key={item.id} href={item.href}>{item.title}</a>)}<a href="/ferramentas">Ferramentas</a></nav>
      <div className="proto-header-actions"><Button variant="ghost" size="icon" aria-label="Abrir busca" onClick={() => { setOpen(true); }}><Search /></Button><Button variant="outline" size="icon" aria-label="Abrir menu" onClick={() => setOpen(true)}><Menu /></Button></div>
    </header>
    <Sheet open={open} onClose={() => setOpen(false)} title="Explore o portal"><PortalSearch /><nav className="proto-sheet-nav" aria-label="Seções do portal">{portalPaths.map(item => <a key={item.id} href={item.href}><item.icon size={20} />{item.title}<ArrowUpRight size={16} /></a>)}</nav></Sheet>
  </>;
}
