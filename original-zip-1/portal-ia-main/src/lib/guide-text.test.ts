import { describe, expect, it } from "vitest";
import type { Guide } from "@/data/guides";
import { anchorChapters, chapterBody, chapterMarkdown, chaptersOf, headingsOf, outline, pageMarkdown, partsOf, sectionsOf, withHeadingIds } from "./guide-text";

const guide = { slug: "g", title: "Guia", summary: "Resumo.", minutes: 10 } as Guide;

const SOURCE = `Abertura do guia.

**PRIMEIRA PARTE**

## 1 Um capítulo {#um}

Texto com [PRD](#sigla) e um [link](/x).

### Subtítulo {#sub}

Mais texto aqui, com várias palavras para pesar o capítulo.

## 2 Outro capítulo {#dois}

Fim.
`;

describe("the text of a guide", () => {
  it("lists the sections with their numbers, without the Markdown of the title", () => {
    expect(outline("## 1.2 Um **forte** [link](/x) {#a}\n\n## B {#b}\n")).toEqual([
      { id: "a", number: "1.2", text: "Um forte link" },
      { id: "b", number: "", text: "B" },
    ]);
  });

  it("cuts the chapters at each section, with the opening and the label of a part that comes just before a chapter", () => {
    const { opening, chapters } = chaptersOf(guide, SOURCE);
    expect(opening).toBe("Abertura do guia.");
    expect(chapters.map((c) => [c.id, c.number, c.title, c.part])).toEqual([
      ["um", "1", "Um capítulo", "Primeira parte"],
      ["dois", "2", "Outro capítulo", null],
    ]);
    expect(chapters.every((c) => c.minutes >= 1)).toBe(true);
    expect(partsOf(chapters).map((p) => [p.part, p.chapters.length])).toEqual([["Primeira parte", 1], [null, 1]]);
  });

  it("maps every id inside a chapter to that chapter", () => {
    const anchors = anchorChapters(chaptersOf(guide, SOURCE).chapters);
    expect(anchors.get("um")).toBe("um");
    expect(anchors.get("sub")).toBe("um");
    expect(anchors.get("dois")).toBe("dois");
  });

  it("copies a page and a chapter without the heading ids and without the acronym links", () => {
    const page = pageMarkdown(guide, SOURCE);
    expect(page).toMatch(/^# Guia\n\nResumo\.\n\n/);
    expect(page).not.toMatch(/\{#|\(#sigla\)/);
    expect(page).toContain("Texto com PRD e um [link](/x).");
    const chapter = chapterMarkdown(guide, chaptersOf(guide, SOURCE).chapters[0] ?? { source: "" });
    expect(chapter).toMatch(/^# Guia\n\n## 1 Um capítulo\n/);
    expect(chapter).not.toMatch(/\{#|\(#sigla\)/);
  });
});

const FENCED = `## Capítulo {#cap}

Abertura.

#### 1 Setup

\`\`\`\`markdown
# Um arquivo inteiro dentro do trecho

\`\`\`bash
## não é título
\`\`\`
\`\`\`\`

#### O que é o [SDD](#sigla)

#### Setup

#### Já tem id {#fixo}
`;

describe("the headings of a guide", () => {
  it("skips the lines inside a fenced block, even a fence that holds another fence", () => {
    expect(headingsOf(FENCED).map((h) => [h.level, h.raw.trim(), h.id])).toEqual([
      [2, "Capítulo", "cap"],
      [4, "1 Setup", null],
      [4, "O que é o [SDD](#sigla)", null],
      [4, "Setup", null],
      [4, "Já tem id", "fixo"],
    ]);
  });

  it("gives an id to each heading that has none, from its title, without repeating one", () => {
    const text = withHeadingIds(FENCED, ["setup-2"]);
    expect(headingsOf(text).map((h) => h.id)).toEqual(["cap", "setup", "o-que-e-o-sdd", "setup-3", "fixo"]);
    expect(text).toContain("## não é título\n");
    expect(text).toContain("#### O que é o [SDD](#sigla) {#o-que-e-o-sdd}");
  });

  it("cuts a long title at a word, and keeps the text as it was", () => {
    const long = "#### 01 Funciona com a minha stack, mesmo não sendo a mesma linguagem do exemplo do guia?";
    const [head] = headingsOf(withHeadingIds(long));
    expect(head?.id).toBe("funciona-com-a-minha-stack-mesmo-nao-sendo-a-mesma-linguagem");
    expect(withHeadingIds("Sem título nenhum.\n")).toBe("Sem título nenhum.\n");
  });

  it("lists the sections of a chapter at its highest level, without the title of the chapter", () => {
    const body = chapterBody(withHeadingIds(FENCED));
    expect(body.startsWith("Abertura.")).toBe(true);
    expect(sectionsOf(body).map((s) => [s.id, s.number, s.text])).toEqual([
      ["setup", "1", "Setup"],
      ["o-que-e-o-sdd", "", "O que é o SDD"],
      ["setup-2", "", "Setup"],
      ["fixo", "", "Já tem id"],
    ]);
  });
});

