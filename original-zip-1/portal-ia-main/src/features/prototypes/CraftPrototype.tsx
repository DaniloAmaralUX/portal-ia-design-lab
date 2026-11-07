import { BookOpen, Blocks, Route, Terminal, ArrowUpRight } from "lucide-react";
import { AccountAvatar, BeautifulCodeBlock, BeautifulProvider, Card, PortalAction, PortalResource, PortalSearch, PrototypeFooter, PrototypeHeader, SkillPack } from "@/design-system";

export function CraftPrototype() {
  return <div className="portal-prototype prototype-craft">
    <a href="/novidades" className="craft-announcement"><span>Novo</span> Conheça os guias para trabalhar com IA. <ArrowUpRight size={15} /></a>
    <PrototypeHeader variant="craft" />
    <section className="craft-hero">
      <div className="craft-people" aria-hidden>{["Engenharia", "Produto", "Qualidade", "Meio"].map(name => <AccountAvatar key={name} name={name} />)}</div>
      <p className="craft-trust">Uma base de conhecimento para todos os papéis</p>
      <h1>Capacitação, método e skills.<br />IA que faz parte do trabalho.</h1>
      <p className="craft-hero-copy">Aprenda na <a href="/academy">Academy</a>, encontre seu caminho no <a href="/metodo">Método</a> e use as <a href="/explorar">skills da Pitang</a> para construir com o Claude Code.</p>
      <div className="craft-actions"><PortalAction href="/primeiros-passos">Começar agora</PortalAction><PortalAction href="/explorar" secondary>Explorar skills</PortalAction></div>
      <p className="craft-caption">Do primeiro passo à próxima entrega.</p>
      <div className="craft-teams"><p>Conhecimento que conecta o time</p><div><span><Terminal />Engenharia</span><span><Blocks />Produto</span><span><Route />Qualidade</span><span><BookOpen />Meio</span></div></div>
      <div className="craft-showcase">
        <div className="craft-mini-sidebar"><strong>pitang / ia</strong>{["Visão geral", "Academy", "Método", "Skills", "Plugins"].map((label, i) => <a key={label} href={["/", "/academy", "/metodo", "/explorar", "/plugins"][i]}>{label}</a>)}<small>Conhecimento compartilhado.<br />Melhores entregas.</small></div>
        <div className="craft-mini-content"><span>Seu ponto de partida</span><h2>O que vamos construir hoje?</h2><PortalSearch /><div className="craft-preview-grid">{[0, 1, 2].map(index => <PortalResource key={index} index={index} compact />)}</div></div>
      </div>
    </section>
    <section className="craft-section"><h2>Um portal. Três formas de avançar.</h2><p>Conhecimento organizado para a tarefa que está na sua frente.</p><div className="craft-resource-grid">{[0, 1, 2].map(index => <PortalResource key={index} index={index} />)}</div></section>
    <section className="craft-install"><div><p>Do conhecimento à prática</p><h2>Leve o jeito Pitang<br />para o seu projeto.</h2><p>Skills são instruções reutilizáveis para trabalhar com o Claude Code. Encontre a skill, veja o que ela faz e siga o guia de instalação.</p><PortalAction href="/primeiros-passos">Ver primeiros passos <ArrowUpRight size={16} /></PortalAction></div><Card className="craft-code-card"><BeautifulProvider><BeautifulCodeBlock filename="meu-projeto / CLAUDE.md" lines={["# Contexto do projeto", "", "## Antes de começar", "Leia as regras do time.", "Entenda o problema antes de alterar o código.", "", "## Ao concluir", "Valide o resultado e compartilhe o contexto."]} /></BeautifulProvider></Card></section>
    <section className="craft-bottom"><SkillPack kind={2} /><div><h2>Comece pela sua próxima tarefa.</h2><p>Encontre um guia, uma trilha ou uma skill que ajude agora.</p><PortalAction href="/explorar" secondary>Explorar o portal <ArrowUpRight size={16} /></PortalAction></div></section>
    <PrototypeFooter current="craft" />
  </div>;
}
