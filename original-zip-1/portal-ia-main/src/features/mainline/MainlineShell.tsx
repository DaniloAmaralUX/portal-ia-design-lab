import { type ReactNode, useState } from "react";
import { MainlineNav } from "./MainlineNav";
import { PitangLogo } from "@/components/layout/PitangLogo";
import "@/design-system/mainline/mainline.css";

export function MainlineShell({ children }: { children: ReactNode }) {
  const [input, setInput] = useState("keyboard");
  const [dark, setDark] = useState(false);
  return <div className="portal-prototype mainline" data-theme={dark ? "dark" : "light"} data-input={input} onPointerDown={() => setInput("pointer")} onKeyDown={() => setInput("keyboard")}><MainlineNav dark={dark} onTheme={() => setDark(value => !value)} />{children}<footer className="ml-footer ml-container"><a href="/prototipos/mainline" aria-label="Portal IA, início"><PitangLogo /></a><span>Conhecimento compartilhado. Melhores entregas.</span><nav aria-label="Rodapé"><a href="/prototipos/mainline/catalogo">Catálogo</a><a href="/prototipos/mainline/academy">Academy</a><a href="/prototipos/mainline/guia">Método</a></nav><small>© {new Date().getFullYear()} Pitang Agile IT</small></footer></div>;
}
