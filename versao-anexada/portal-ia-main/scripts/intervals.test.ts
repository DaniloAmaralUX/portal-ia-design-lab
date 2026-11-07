import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { createServer } from "vite";
import { describe, expect, it } from "vitest";
import { intervals, parseInterval } from "./intervals.ts";

const ORIGIN = "https://empresa.sharepoint.com";
const VIDEO = `${ORIGIN}/sites/time/_layouts/15/embed.aspx?UniqueId=abc&embed=%7B%7D`;
const FILE = "src/content/intervals/revisao-de-pr.md";

function source(head: Record<string, string>, text = "O que foi mostrado.") {
  return `---\n${Object.entries(head)
    .map(([name, value]) => `${name}: ${value}`)
    .join("\n")}\n---\n\n${text}\n`;
}

const HEAD = { title: "Revisão de PR com o pr-review", date: "2026-10-15", minutes: "42", area: "engenharia", summary: "As seis revisões de PR, uma por ângulo.", video: VIDEO };

describe("a technical break, read from its file", () => {
  it("reads the head and the text, and takes the address of the page from the name of the file", () => {
    expect(parseInterval(FILE, source(HEAD), ORIGIN)).toEqual({
      interval: { slug: "revisao-de-pr", title: HEAD.title, date: "2026-10-15", minutes: 42, area: "engenharia", summary: HEAD.summary, video: VIDEO },
      text: "O que foi mostrado.",
    });
  });

  it("leaves the minutes out when the head does not have them", () => {
    const { minutes: _minutes, ...head } = HEAD;
    expect(parseInterval(FILE, source(head), ORIGIN).interval.minutes).toBeNull();
  });

  it("takes a break of every area when the head leaves the area out, and a value between quotes", () => {
    const { area: _area, ...head } = HEAD;
    const parsed = parseInterval(FILE, source({ ...head, title: '"Fluxo: do PBI ao código"' }), ORIGIN);
    expect(parsed.interval.area).toBeNull();
    expect(parsed.interval.title).toBe("Fluxo: do PBI ao código");
  });

  it("stops without SHAREPOINT_ORIGIN, since the recording would have no iframe to play in, and says what to put in the .env", () => {
    expect(() => parseInterval(FILE, source(HEAD), null)).toThrow(/SHAREPOINT_ORIGIN is missing[\s\S]*\.env/);
  });

  it.each([
    ["no head", "Só o texto.", "head between two --- lines"],
    ["a missing title", source({ ...HEAD, title: "" }), "missing title"],
    ["a missing summary", source({ ...HEAD, summary: "" }), "missing summary"],
    ["a field the head does not have", source({ ...HEAD, speaker: "Fulana" }), "no field speaker"],
    ["a date that is not a day", source({ ...HEAD, date: "15/10/2026" }), "date must be a day"],
    ["minutes that are not whole", source({ ...HEAD, minutes: "42.5" }), "minutes must be"],
    ["an area the site does not have", source({ ...HEAD, area: "design" }), "area must be one of"],
    ["a video outside SharePoint", source({ ...HEAD, video: "https://www.youtube.com/embed/abc" }), "https address of SharePoint"],
    ["a video over http", source({ ...HEAD, video: "http://empresa.sharepoint.com/x" }), "https address of SharePoint"],
    ["a video in another SharePoint", source({ ...HEAD, video: "https://outra.sharepoint.com/x" }), "must be in https://empresa.sharepoint.com"],
    ["an empty text", source(HEAD, ""), "the text that explains the break"],
  ])("refuses %s, and names the file", (_name, text, message) => {
    expect(() => parseInterval(FILE, text, ORIGIN)).toThrow(message);
    expect(() => parseInterval(FILE, text, ORIGIN)).toThrow(FILE);
  });

  it("refuses a file name that cannot be the address of a page", () => {
    expect(() => parseInterval("src/content/intervals/Revisão de PR.md", source(HEAD), ORIGIN)).toThrow("name of the file");
  });
});

describe("the technical breaks on the dev server", () => {
  // The build never saw it: the folder went to addWatchFile, and once it appeared with the dev server running, the server read it as
  // an import it could not resolve and answered 500 for the list.
  it("keeps serving the list when the folder of the breaks appears with the server running", async () => {
    const root = mkdtempSync(path.join(tmpdir(), "intervals-"));
    const server = await createServer({ configFile: false, root, logLevel: "silent", plugins: [intervals({ sharepointOrigin: "https://empresa.sharepoint.com" })], server: { port: 0, hmr: false } });
    await server.listen();
    const address = server.httpServer?.address();
    const ask = (url: string) => fetch(`http://localhost:${typeof address === "object" && address ? address.port : 0}${url}`);
    try {
      expect((await ask("/@id/__x00__virtual:intervals")).status).toBe(200);
      mkdirSync(path.join(root, "src/content/intervals"), { recursive: true });
      writeFileSync(path.join(root, "src/content/intervals/revisao-de-pr.md"), source({ ...HEAD, video: "https://empresa.sharepoint.com/x" }));
      await expect.poll(async () => (await (await ask("/@id/__x00__virtual:intervals")).text()).includes("revisao-de-pr"), { timeout: 10_000 }).toBe(true);
      for (const url of ["/@id/__x00__virtual:intervals", "/@id/__x00__virtual:interval-text"]) expect((await ask(url)).status, url).toBe(200);
    } finally {
      await server.close();
      rmSync(root, { recursive: true, force: true });
    }
  });
});
