import { describe, expect, it } from "vitest";
import { skills } from "@/data/catalog";
import { intervals } from "@/data/intervals";
import { courses } from "@/data/trainings";
import { radical, terms } from "@/lib/search";
import { searchSite, searchSkills } from "@/lib/site-search";

const first = (query: string, n = 3) => searchSkills(query, skills).slice(0, n).map((s) => s.slug);

describe("radical", () => {
  it("reduces plurals, verb inflections and accents to the same stem", () => {
    expect(new Set(["testar", "teste", "testes"].map(radical))).toEqual(new Set(["test"]));
    expect(new Set(["transformar", "transforme", "transforma"].map(radical))).toEqual(new Set(["transform"]));
    expect(new Set(terms("revisar revisão revise"))).toEqual(new Set(["revis"]));
    expect(new Set(terms("documentação documentar documente"))).toEqual(new Set(["document"]));
  });

  it("does not truncate short words", () => {
    expect(radical("gerar")).toBe("gerar");
    expect(radical("api")).toBe("api");
  });
});

describe("natural-language search", () => {
  const cases: [string, string][] = [
    ["quero revisar a segurança do meu PR", "pg-revisar-seguranca"],
    ["preciso gerar a documentação da API do meu serviço", "pg-create-api-doc"],
    ["como faço para escrever histórias de usuário a partir de uma reunião", "pg-us-create"],
    ["transformar ata de reunião em histórias", "pg-us-create"],
    ["criar testes automatizados", "pg-create-automation-tests"],
    ["gerar slides para a diretoria", "pg-criar-apresentacao"],
    ["apresentação", "pg-criar-apresentacao"],
    ["commit", "pg-conventional-commits"],
    ["documentar banco", "pg-create-database-doc"],
    ["revisar código", "pg-revisar-qualidade"],
    ["massa de dados para teste", "pg-create-automation-test-data"],
    ["importar work item do azure", "pg-generate-work-item-md"],
    ["vulnerabilidade", "pg-revisar-seguranca"],
    ["onboarding de projeto", "pg-create-setup-guide"],
  ];
  for (const [query, expected] of cases) {
    it(`"${query}" returns ${expected} first`, () => {
      expect(first(query, 1)).toEqual([expected]);
    });
  }

  it('"melhorar o texto de um e-mail" returns pg-escrever-texto in the top two', () => {
    expect(first("melhorar o texto de um e-mail", 2)).toContain("pg-escrever-texto");
  });

  it('"diagrama de arquitetura" returns the C4 model skill in the top two', () => {
    expect(first("diagrama de arquitetura", 2)).toContain("pg-c4-model");
  });

  it('"user story" and "especificação" find the requirements skills', () => {
    expect(first("user story", 2)).toContain("pg-us-create");
    expect(first("especificação", 3)).toContain("pg-spec-create");
  });

  it('"testar" finds the testing skills', () => {
    const found = searchSkills("testar", skills);
    expect(found.length).toBeGreaterThan(0);
    for (const s of found.slice(0, 5)) expect(["automation-bdd", "pr-review"]).toContain(s.plugin);
  });

  it('"revisar PR" and "code review" put the six PR review skills first', () => {
    for (const query of ["revisar PR", "code review"]) {
      const six = searchSkills(query, skills).slice(0, 6).map((s) => s.plugin);
      expect(six, query).toEqual(Array(6).fill("pr-review"));
    }
  });

  it('"revisão" does not return half the catalog', () => {
    const found = searchSkills("revisão", skills);
    const review = skills.filter((s) => s.plugin === "pr-review").map((s) => s.slug);
    // Each skill now declares one example, so a skill of another plugin that says "revisão" in what it delivers can come in among them.
    expect(found.slice(0, 8).map((s) => s.slug)).toEqual(expect.arrayContaining(review));
    expect(found.length).toBeLessThan(15);
  });

  it('"refatorar" does not make up results', () => {
    expect(searchSkills("refatorar", skills)).toEqual([]);
  });
});

describe("site-wide search", () => {
  it("finds the Academy chapter by topic", () => {
    const academy = searchSite("pipeline do compozy").filter((r) => r.item.kind === "academy");
    expect(academy[0]?.id).toBe("academy:compozy:pipeline");
  });

  it("finds the plugin by name and the page by title", () => {
    expect(searchSite("automação de testes bdd")[0]?.id).toBe("plugin:automation-bdd");
    expect(searchSite("academy").some((r) => r.id === "page:/academy")).toBe(true);
    expect(searchSite("manifesto").some((r) => r.id === "page:/manifesto")).toBe(true);
  });

  it("finds the role's track, the area's roadmap and the page on studying in Portuguese", () => {
    const ids = (query: string) => searchSite(query).map((r) => r.id);
    expect(ids("desenvolvedor")).toContain("page:/academy/trilhas/$area:engenharia");
    expect(ids("trilha qa")).toContain("page:/academy/trilhas/$area:qualidade");
    expect(ids("roteiro de qualidade")).toContain("page:/metodo/roteiros/$area:qualidade");
    expect(ids("legenda")).toContain("page:/academy/em-portugues");
  });

  it("finds every course by its title, every lesson by its course and its title, every technical break by its title, and the page of the trainings", () => {
    const ids = (query: string) => searchSite(query).map((r) => r.id);
    for (const course of courses) {
      expect(ids(course.title)[0], course.slug).toBe(`training:${course.slug}`);
      for (const lesson of course.lessons) {
        const id = `training:${course.slug}/${lesson.number}`;
        expect(ids(`${course.title} ${lesson.title}`).slice(0, 3), id).toContain(id);
      }
    }
    for (const interval of intervals) expect(ids(interval.title).slice(0, 3), interval.slug).toContain(`interval:${interval.slug}`);
    expect(ids("treinamentos")).toContain("page:/academy/treinamentos");
  });
});
