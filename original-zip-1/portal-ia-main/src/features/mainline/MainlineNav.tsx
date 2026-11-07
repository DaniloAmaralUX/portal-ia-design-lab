import { useState } from "react";
import { ArrowUpRight, BookOpen, Blocks, ChevronDown, Menu, Moon, Route, Sun, X } from "lucide-react";
import { PitangLogo } from "@/components/layout/PitangLogo";
import { MainlineButton as Button } from "@/design-system/mainline/MainlineButton";
import { usePointerFeedback } from "@/components/craft/StateIcon";
import { motion, useReducedMotion } from "motion/react";

export function MainlineNav({ dark, onTheme }: { dark: boolean; onTheme: () => void }) {
  const [open, setOpen] = useState(false);
  const { instant, record } = usePointerFeedback();
  const reduce = useReducedMotion();
  return <header className="ml-navbar" onKeyDown={event => { if (event.key === "Escape") setOpen(false); }}>
    <div className="ml-navbar-row"><a href="/prototipos/mainline" aria-label="Portal IA, início"><PitangLogo className="ml-logo" /></a><nav aria-label="Navegação principal" className="ml-desktop-nav"><a href="/prototipos/mainline/catalogo">Explorar <ChevronDown size={12} /></a><a href="/prototipos/mainline/academy">Academy</a><a href="/prototipos/mainline/guia">Método</a></nav><div className="ml-nav-actions"><Button variant="ghost" size="icon" onClick={onTheme} aria-label={dark ? "Usar tema claro" : "Usar tema escuro"}>{dark ? <Sun /> : <Moon />}</Button><Button asChild variant="outline" className="ml-nav-start"><a href="/prototipos/mainline/academy">Seu caminho <ArrowUpRight /></a></Button><Button variant="ghost" size="icon" className="ml-mobile-trigger" aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open} aria-controls="mainline-menu" onClick={event => { record(event); setOpen(value => !value); }}>{open ? <X /> : <Menu />}</Button></div></div>
    {open && <motion.nav id="mainline-menu" aria-label="Seções do portal" initial={instant || reduce ? false : { opacity: 0, transform: "translateY(-4px)" }} animate={{ opacity: 1, transform: "translateY(0)" }} transition={{ duration: instant || reduce ? 0 : .16, ease: [.23, 1, .32, 1] }} className="ml-mobile-menu"><a href="/prototipos/mainline/catalogo"><Blocks />Catálogo<ArrowUpRight /></a><a href="/prototipos/mainline/academy"><BookOpen />Academy<ArrowUpRight /></a><a href="/prototipos/mainline/guia"><Route />Método<ArrowUpRight /></a><a href="/design-system">Design system<ArrowUpRight /></a></motion.nav>}
  </header>;
}
