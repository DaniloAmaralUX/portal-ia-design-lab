import { describe, expect, it } from "vitest";
import { REQUIREMENTS } from "./catalyst-example";
import { figureName, figuresIn } from "./figure-name";
import { figureNames, isFigure } from "./guide-figures";

const guides = import.meta.glob<string>("../../../content/guides/*.md", { eager: true, query: "?raw", import: "default" });
const sources = Object.entries(guides).map(([file, text]) => ({ name: file.split("/").at(-1) ?? file, text }));

describe("figureName", () => {
  it("reads the name of a figure of the site, and nothing from a file of a guide", () => {
    expect(figureName("figura/catalyst-radar")).toBe("catalyst-radar");
    expect(figureName("img/sdd-1.png")).toBeNull();
    expect(figureName("figura/")).toBeNull();
  });

  it("finds only the figures that stand alone on their line", () => {
    expect(figuresIn("Texto.\n\n![O radar](figura/catalyst-radar)\n\nMais ![no meio](figura/catalyst-ciclo) de um texto.")).toEqual(["catalyst-radar"]);
  });
});

describe("the figures of the guides", () => {
  const called = sources.flatMap((s) => figuresIn(s.text));

  it("draw every figure a guide calls, and no figure a guide does not call", () => {
    expect([...new Set(called)].sort()).toEqual([...figureNames].sort());
    for (const name of called) expect(isFigure(`figura/${name}`), name).toBe(true);
  });

  it("are called each alone on its line, with the text of what they show", () => {
    for (const { name, text } of sources) {
      const inline = text.split("\n").filter((line) => line.includes("](figura/") && !/^!\[[^\]]+\]\(figura\/[\w-]+\)$/.test(line));
      expect(inline, name).toEqual([]);
    }
  });

  it("draw the example project with the requirements of the guide of the Catalyst Toolkit, and the minimum of 2 on its critical ones", () => {
    const guide = sources.find((s) => s.name === "catalyst-toolkit.md")?.text ?? "";
    const codes = [...guide.matchAll(/^\| (R\d) · [^|]+ \| [^|]+\? \|$/gm)].map(([, code]) => code);
    expect(codes).toEqual(REQUIREMENTS.map((r) => r.code));
    const critical = [...(/requisitos críticos, ([^:]+):/.exec(guide)?.[1] ?? "").matchAll(/R\d/g)].map(([code]) => code);
    expect(critical).toHaveLength(5);
    expect(REQUIREMENTS.filter((r) => r.minimum === 2).map((r) => r.code)).toEqual(critical);
  });
});
