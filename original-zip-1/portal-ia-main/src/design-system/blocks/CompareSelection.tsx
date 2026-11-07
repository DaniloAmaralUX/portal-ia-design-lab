import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "../primitives";
import { SkillPack } from "./SkillPack";
import { portalPaths } from "./portal-paths";
export function CompareSelection() {
  const [selected, setSelected] = useState<string[]>([]);
  return <div className="proto-comparison"><div className="proto-compare-table-wrap" tabIndex={0} role="region" aria-label="Comparação das seções do portal"><table><caption className="sr-only">Compare Academy, Método e Skills</caption><thead><tr><td />{portalPaths.map((item, index) => <th key={item.id} scope="col"><SkillPack kind={index} small /><span>{item.title}</span><small>{item.detail}</small></th>)}</tr></thead><tbody>{[
    ["Para quem", "Quem quer aprender", "Quem está entregando", "Quem usa Claude Code"],
    ["Como começar", "Escolha seu papel", "Escolha um guia", "Busque uma tarefa"],
    ["Formato", "Trilhas e treinamentos", "Guias e roteiros", "Skills e plugins"],
    ["No seu ritmo", "Sim", "Sim", "Sim"],
  ].map(row => <tr key={row[0]}>{row.map((cell, index) => index === 0 ? <th key={cell} scope="row">{cell}</th> : <td key={cell + index}>{cell}</td>)}</tr>)}<tr><th scope="row">Minha seleção</th>{portalPaths.map(item => <td key={item.id}><Button variant="outline" aria-pressed={selected.includes(item.id)} onClick={() => setSelected(prev => prev.includes(item.id) ? prev.filter(x => x !== item.id) : [...prev, item.id])}>{selected.includes(item.id) ? <><Check />Selecionado</> : <>Adicionar <span aria-hidden>+</span></>}</Button></td>)}</tr></tbody></table></div><p role="status" className="proto-selection-status">{selected.length ? `${selected.length} ${selected.length === 1 ? "seção selecionada" : "seções selecionadas"} para explorar` : "Selecione as seções que quer explorar."}{selected.length > 0 && <Button variant="ghost" onClick={() => setSelected([])} aria-label="Limpar seleção"><X size={14} /></Button>}</p></div>;
}
