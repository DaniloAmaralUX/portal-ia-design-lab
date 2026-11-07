import { existsSync, readdirSync, readFileSync } from "node:fs";
import { areas } from "../src/data/areas";
import { PAGES } from "../src/data/pages";
import { guidePath, guides, sectionOf } from "../src/data/guides";
import { chaptersOf } from "../src/lib/guide-text";
import { ROLES } from "../src/data/roles";
import { loadRelease } from "../scripts/skills-source";

// The pages with a fixed address are the ones of src/data/pages.ts, which the search lists too.
export const STATIC_PAGES: string[] = PAGES.filter((page) => !page.params).map((page) => page.to);

export function routes(): string[] {
  const out = [...STATIC_PAGES];
  for (const role of ROLES) out.push(`/academy/trilhas/${role.area}`);
  for (const area of areas) out.push(`/metodo/roteiros/${area.id}`);
  const release = loadRelease();
  for (const plugin of release.plugins) out.push(`/plugins/${plugin.name}`);
  for (const skill of release.skills) out.push(`/plugins/${skill.plugin}/${skill.slug}`);
  // The guides of the Method and of Ferramentas; the manifesto is a page of PAGES.
  for (const guide of guides.filter((g) => sectionOf(g) !== "manifesto")) {
    out.push(guidePath(guide));
    if (!guide.chapters) continue;
    const source = readFileSync(new URL(`../src/content/guides/${guide.slug}.md`, import.meta.url), "utf8");
    for (const chapter of chaptersOf(guide, source).chapters) out.push(`${guidePath(guide)}/${chapter.id}`);
  }
  // Each technical break is a file of src/content/intervals, and the name of the file is the address of its page.
  const intervals = new URL("../src/content/intervals/", import.meta.url);
  if (existsSync(intervals)) for (const name of readdirSync(intervals).filter((n) => n.endsWith(".md"))) out.push(`/academy/intervalos/${name.slice(0, -3)}`);
  // Each course is a folder of src/content/trainings, and each lesson a file of it named by its number: both are addresses of pages.
  const trainings = new URL("../src/content/trainings/", import.meta.url);
  if (existsSync(trainings)) {
    for (const course of readdirSync(trainings)) {
      out.push(`/academy/treinamentos/${course}`);
      const lessons = readdirSync(new URL(`${course}/`, trainings)).filter((n) => n.endsWith(".md") && n !== "course.md");
      for (const name of lessons) out.push(`/academy/treinamentos/${course}/${name.slice(0, -3)}`);
    }
  }
  return out;
}

export const REPRESENTATIVE_PAGES = [
  "/",
  "/explorar",
  "/explorar?q=revisar",
  "/explorar?q=nada-com-isso-aqui",
  "/plugins",
  "/plugins/pr-review",
  "/plugins/pr-review/pg-revisar-seguranca",
  "/plugins/communication/pg-criar-apresentacao",
  "/academy",
  "/academy/trilhas/engenharia",
  "/manifesto",
  "/academy/em-portugues",
  "/academy/glossario",
  "/academy/intervalos",
  "/metodo",
  "/metodo/sdd",
  "/metodo/compozy",
  "/metodo/compozy/pipeline",
  "/metodo/compozy/rules?modo=apresentacao&slide=3",
  "/metodo/open-spec",
  "/metodo/open-spec/fluxo",
  "/metodo/spec-kit/fluxo",
  "/metodo/estudo-de-caso",
  "/metodo/esteira",
  "/ferramentas",
  "/ferramentas/catalyst-toolkit",
  "/ferramentas/catalyst-toolkit/doctor",
  "/metodo/roteiros/qualidade",
  "/primeiros-passos",
  "/plugins?kit=pr-review,requirements",
  "/contribuir",
  "/novidades",
  "/publicar/intervalo-tecnico",
  "/essa-rota-nao-existe",
];
