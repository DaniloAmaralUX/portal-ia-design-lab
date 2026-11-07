import { ArrowDown, ArrowUpRight, BookOpen, Check, Layers, Route } from "lucide-react";
import { Card, CompareSelection, PortalAction, PrototypeFooter, PrototypeHeader, SkillPack, portalPaths } from "@/design-system";

export function NovePrototype() {
  return <div className="portal-prototype prototype-nove">
    <PrototypeHeader variant="nove" />
    <div className="nove-content">
      <section className="nove-hero" aria-labelledby="nove-title">
        <Card className="nove-intro"><p>Portal IA da Pitang</p><h1 id="nove-title">Conhecimento<br />e prática.</h1><p className="nove-lead">Aprender, consultar e construir com IA. Uma base comum, três caminhos para fazer parte do seu trabalho.</p><nav aria-label="Qual caminho é para você?">{portalPaths.map(item => <a key={item.id} href={`#nove-${item.id}`}><span><item.icon size={20} />{item.detail}<ArrowDown size={18} /></span><strong>{item.title}</strong><p>{item.description}</p></a>)}</nav></Card>
        <Card className="nove-product-scene"><div className="nove-scene-annotation"><span>Conhecimento do time</span><span>Pronto para a próxima entrega</span></div><div className="nove-hero-pack"><SkillPack kind={1} /></div><div className="nove-scene-bottom"><span>Método Pitang</span><p>Um jeito de trabalhar com IA.</p></div><a href="#compare" className="nove-compare-anchor">Compare os caminhos <ArrowDown size={16} /></a></Card>
      </section>
      <div className="nove-benefits"><span><BookOpen />Aprenda no seu ritmo</span><span><Route />Encontre um guia</span><span><Layers />Reutilize conhecimento</span><span><Check />Compartilhe com o time</span></div>
      <section className="nove-paths"><header><div><p>Escolha pela sua próxima tarefa</p><h2>Os caminhos.</h2></div><a href="#compare">Compare lado a lado <ArrowDown size={15} /></a></header><div className="nove-product-grid">{portalPaths.map((item, index) => <article id={`nove-${item.id}`} key={item.id}><Card className={`nove-product-card nove-product-card-${index}`}><a href={item.href} aria-label={`Explorar ${item.title}`}><SkillPack kind={index} /></a></Card><div className="nove-product-caption"><div><h3><a href={item.href}>{item.title}</a></h3><p>{item.detail}</p></div><PortalAction href={item.href} secondary><ArrowUpRight size={18} /><span className="sr-only">Explorar {item.title}</span></PortalAction></div></article>)}</div></section>
      <section id="compare" className="nove-compare" aria-labelledby="nove-compare-title"><header><p>Lado a lado</p><h2 id="nove-compare-title">Compare.</h2></header><CompareSelection /></section>
      <section className="nove-bundle"><header><p>Leve para o trabalho</p><h2>Na prática.</h2></header><Card><div><span>Claude Code + conhecimento Pitang</span><h3>Seu próximo projeto,<br />com mais contexto.</h3><p>Conheça as skills, entenda como funcionam e siga o guia para preparar seu ambiente.</p><PortalAction href="/primeiros-passos">Preparar meu ambiente <ArrowUpRight size={16} /></PortalAction></div><div className="nove-bundle-packs"><SkillPack kind={2} /><SkillPack kind={1} /></div></Card></section>
      <section className="nove-closing"><p>Construir com IA é um aprendizado contínuo.</p><h2>Comece pelo que<br />você precisa hoje.</h2><div><PortalAction href="/academy">Escolher minha trilha</PortalAction><PortalAction href="/explorar" secondary>Explorar skills <ArrowUpRight size={16} /></PortalAction></div></section>
    </div>
    <PrototypeFooter current="nove" />
  </div>;
}
