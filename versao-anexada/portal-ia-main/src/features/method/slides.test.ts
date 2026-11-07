import { describe, expect, it } from "vitest";
import { slidesOf } from "./slides";

const cover = { kicker: "Guia · Ato 1", number: "1.2", title: "O que é", lead: "O resumo do guia." };

const words = (n: number) => Array.from({ length: n }, (_, i) => `palavra${i}`).join(" ");

describe("the slides of a text", () => {
  it("opens with the cover, and a short opening goes on it under the title", () => {
    const [first, ...rest] = slidesOf(cover, "Uma abertura curta.\n\n## Seção {#secao}\n\nTexto.\n");
    expect(first).toEqual({ cover: true, id: null, kicker: "Guia · Ato 1", number: "1.2", title: "O que é", body: "Uma abertura curta." });
    expect(rest.map((s) => [s.id, s.title, s.body])).toEqual([["secao", "Seção", "Texto."]]);
  });

  it("gives a long opening a slide of its own, and the cover keeps the summary", () => {
    const [first, second] = slidesOf(cover, `${words(80)}\n\n## Seção {#secao}\n`);
    expect(first?.body).toBe("O resumo do guia.");
    expect(second).toMatchObject({ id: null, kicker: "O que é", title: null });
  });

  it("keeps a short section whole, sub-headings and all", () => {
    const source = "## A pitangueira {#pitangueira}\n\nCinco partes.\n\n### Raízes\n\nAs pessoas.\n\n### Tronco\n\nO apoio.\n";
    const slides = slidesOf(cover, source).slice(1);
    expect(slides).toHaveLength(1);
    expect(slides[0]?.body).toContain("### Raízes");
  });

  it("cuts a long section at the level below, with the section as the kicker of each part", () => {
    const source = `## 1 Princípios {#principios}\n\nAntes das partes.\n\n### 1.1 Fonte bruta {#fonte}\n\n${words(90)}\n\n#### Detalhe\n\nFica no slide.\n\n### 1.2 Formato {#formato}\n\n${words(90)}\n\n## Tabela {#tabela}\n\n| a | b |\n|---|---|\n`;
    expect(slidesOf(cover, source).slice(1).map((s) => [s.id, s.kicker, s.number, s.title])).toEqual([
      ["principios", null, "1", "Princípios"],
      ["fonte", "Princípios", "1.1", "Fonte bruta"],
      ["formato", "Princípios", "1.2", "Formato"],
      ["tabela", null, "", "Tabela"],
    ]);
    expect(slidesOf(cover, source)[2]?.body).toContain("#### Detalhe");
  });

  it("gives a part with no id of its own the id of its section, where leaving the presentation lands", () => {
    const source = `## Desafios {#desafios}\n\nTrês casos.\n\n### Escopo\n\n${words(90)}\n\n### Contexto {#contexto}\n\n${words(90)}\n`;
    expect(slidesOf(cover, source).slice(1).map((s) => [s.id, s.title])).toEqual([
      ["desafios", "Desafios"],
      ["desafios", "Escopo"],
      ["contexto", "Contexto"],
    ]);
  });

  it("does not take a heading inside a code block for a slide", () => {
    const source = "#### Prompt {#prompt}\n\n```markdown\n# Título do arquivo\n## Passo 1\n```\n\n#### Fim {#fim}\n\nTexto.\n";
    expect(slidesOf(cover, source).map((s) => s.title)).toEqual(["O que é", "Prompt", "Fim"]);
  });
});
