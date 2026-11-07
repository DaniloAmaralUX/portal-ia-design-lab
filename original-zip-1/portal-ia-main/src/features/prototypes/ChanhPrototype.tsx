import { ArrowUpRight, BookOpen, Blocks, MapPin, Route, Terminal } from "lucide-react";
import { LineNav, CopyButton, PitangLogo, PortalAction, PortalResource, PortalSculpture, PrototypeFooter, PrototypeHeader, SkillPack } from "@/design-system";

export function ChanhPrototype() {
  return <div className="portal-prototype prototype-chanh">
    <PrototypeHeader variant="chanhdai" />
    <aside className="chanh-section-nav" aria-label="Neste prot?tipo"><LineNav items={[{ title: "Vis?o geral", href: "#chanh-title" }, { title: "Caminhos", href: "#chanh-paths" }, { title: "Primeiros passos", href: "#chanh-guide" }]} /></aside>
    <div className="chanh-column">
      <section className="chanh-identity" aria-labelledby="chanh-title">
        <figure className="chanh-drawing"><PortalSculpture /><figcaption><span>30°</span><span>Conhecimento em camadas.</span></figcaption></figure>
        <div className="chanh-avatar"><div className="chanh-dimension">Ø160</div><PitangLogo /></div>
        <div className="chanh-name"><h1 id="chanh-title">Portal IA <span aria-label="Pitang">✳</span></h1><p>Pequenos avanços. Conhecimento compartilhado.</p></div>
      </section>
      <section className="chanh-overview" aria-label="Visão geral"><p><Terminal />Capacitação, método e skills <span className="chanh-muted">@</span> <strong>Pitang</strong></p><p><MapPin />Feito para o nosso jeito de trabalhar.</p></section>
      <nav className="chanh-social" aria-label="Acessos rápidos"><a href="/academy"><BookOpen />Academy <ArrowUpRight /></a><a href="/metodo"><Route />Método <ArrowUpRight /></a><a href="/explorar"><Blocks />Skills <ArrowUpRight /></a></nav>
      <section className="chanh-intro"><h2>Sobre o portal</h2><div><p>Um lugar para aprender, consultar e colocar a IA para trabalhar com você.</p><ul><li>A <a href="/academy">Academy</a> organiza a capacitação por papel, com trilhas e treinamentos para estudar no seu ritmo.</li><li>O <a href="/metodo">Método</a> reúne os guias de como a Pitang trabalha com IA, da descoberta à entrega.</li><li>As <a href="/explorar">skills e os plugins</a> levam o conhecimento do time para o Claude Code.</li></ul></div></section>
      <div className="chanh-separator" aria-hidden />
      <section id="chanh-paths" className="chanh-paths"><header><h2>Escolha seu caminho</h2><span>3 possibilidades</span></header><div>{[0, 1, 2].map(index => <PortalResource key={index} index={index} compact />)}</div></section>
      <div className="chanh-separator" aria-hidden />
      <section id="chanh-guide" className="chanh-guide"><header><h2>Comece por aqui</h2><a href="/primeiros-passos">Ver guia <ArrowUpRight size={15} /></a></header><div><SkillPack kind={2} /><article><span>Claude Code</span><h3>Seu primeiro projeto com IA</h3><p>Entenda as ferramentas, conheça as skills do time e prepare o contexto antes de começar.</p><PortalAction href="/primeiros-passos" secondary>Primeiros passos <ArrowUpRight size={15} /></PortalAction></article></div></section>
      <div className="chanh-separator" aria-hidden />
      <section className="chanh-contribute"><header><h2>Conhecimento que cresce com o time</h2></header><p>Encontrou uma forma melhor de trabalhar? Compartilhe um aprendizado, proponha uma skill ou contribua com os guias.</p><PortalAction href="/contribuir" secondary>Como contribuir <ArrowUpRight size={15} /></PortalAction><div className="chanh-copy"><code>Aprender. Experimentar. Compartilhar.</code><CopyButton text="Aprender. Experimentar. Compartilhar." name="Copiar princípio do portal" /></div></section>
    </div>
    <PrototypeFooter current="chanhdai" />
  </div>;
}
