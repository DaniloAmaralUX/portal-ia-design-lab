import { describe, expect, it } from "vitest";
import { getGuide } from "@/data/guides";
import { loadGuide } from "@/data/guide-loader";
import { outline } from "@/lib/guide-text";
import { withoutLeadLinks } from "./manifesto-text";

describe("the text of the manifesto page", () => {
  it("drops the row of links on the first line and keeps everything else", () => {
    expect(withoutLeadLinks("[Por onde começar](#comecar) · [Por que agora](#por-que)\n\n## Por que agora {#por-que}\n\nTexto.\n")).toBe(
      "## Por que agora {#por-que}\n\nTexto.\n",
    );
    expect(withoutLeadLinks("## Por que agora {#por-que}\n\nTexto com [Por onde começar](#comecar).\n")).toBe(
      "## Por que agora {#por-que}\n\nTexto com [Por onde começar](#comecar).\n",
    );
  });

  it("leaves the sections of the real manifesto as they are", async () => {
    const guide = getGuide("manifesto");
    expect(guide).toBeDefined();
    const source = await loadGuide("manifesto");
    expect(source.startsWith("[Por onde começar]")).toBe(true);
    const shown = withoutLeadLinks(source);
    expect(shown.startsWith("## Por que agora")).toBe(true);
    expect(outline(shown)).toEqual(outline(source));
    expect(shown.length).toBeLessThan(source.length);
  });
});
