import { describe, expect, it } from "vitest";
import { chaptersOf } from "@/lib/guide-text";
import { COMMAND, SETUP, systemOf, TOOLKIT, TOOLKIT_CARDS } from "./catalyst-toolkit";
import { getGuide, guidePath, MOVED_GUIDES, readingOrder, sectionOf, toolGuides } from "./guides";

const sources = import.meta.glob<string>("../content/guides/*.md", { query: "?raw", import: "default", eager: true });
const sourceOf = (slug: string) => sources[`../content/guides/${slug}.md`] ?? "";

function chaptersIn(slug: string) {
  const guide = getGuide(slug);
  return guide ? chaptersOf(guide, sourceOf(slug)).chapters : [];
}

describe("the page of the Catalyst Toolkit", () => {
  const chapters = chaptersIn(TOOLKIT.slug);

  it("is a tool of Ferramentas, the first of the section, out of the reading order of the Method", () => {
    const guide = getGuide(TOOLKIT.slug);
    expect(guide && sectionOf(guide)).toBe("tools");
    expect(guide && guidePath(guide)).toBe("/ferramentas/catalyst-toolkit");
    expect(toolGuides[0]?.slug).toBe(TOOLKIT.slug);
    expect(readingOrder.map((g) => g.slug)).not.toContain(TOOLKIT.slug);
  });

  it("opens a chapter with each card, and every chapter but the install has a card", () => {
    expect(TOOLKIT_CARDS.map((card) => card.chapter)).toEqual(chapters.map((c) => c.id).filter((id) => id !== "instalar"));
  });

  it("installs with one command, and each step of the first time uses a command the chapter Instalar writes", () => {
    const install = chapters.find((c) => c.id === "instalar")?.source ?? "";
    expect(COMMAND).toBe("npm i -g @pitang/catalyst-toolkit");
    for (const { steps } of Object.values(SETUP)) for (const { commands = [] } of steps) for (const command of commands) expect(install, command).toContain(command);
  });

  it("asks the same of the three systems the first time, with the sandbox on Linux and the WSL2 first on Windows", () => {
    const texts = (system: keyof typeof SETUP) => SETUP[system].steps.map((step) => step.commands?.join(" ") ?? step.text);
    expect(texts("linux").filter((t) => !t.includes("bubblewrap"))).toEqual(texts("macos"));
    expect(texts("windows")).toEqual(["wsl --install", ...texts("linux")]);
    for (const { steps } of Object.values(SETUP)) expect(steps.at(-1)?.commands).toEqual([COMMAND]);
  });

  it.each([
    ["MacIntel", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36", "macos"],
    ["Win32", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", "windows"],
    ["Linux x86_64", "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36", "linux"],
    ["Linux armv81", "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36", "macos"],
    ["", "", "macos"],
  ])("opens the install of %s on the tab of its system", (platform, userAgent, system) => {
    expect(systemOf(platform, userAgent)).toBe(system);
  });
});

describe("the guides that moved", () => {
  it.each(Object.entries(MOVED_GUIDES))("%s lands on chapters that exist", (_, moved) => {
    const ids = chaptersIn(moved.guide).map((c) => c.id);
    expect(ids.length).toBeGreaterThan(0);
    for (const chapter of [...Object.values(moved.chapters), moved.otherwise]) expect(ids, chapter).toContain(chapter);
  });
});
