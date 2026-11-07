import { describe, expect, it } from "vitest";
import { loadGuide } from "./guide-loader";
import { hasGuideSource } from "./guide-source";
import { guides } from "./guides";

describe("the text of the guides in the browser", () => {
  it.each(guides.map((guide) => [guide.slug, Boolean(guide.chapters)] as const))("%s: only a guide read whole has its text in the loader", async (slug, hasChapters) => {
    const hasText = hasGuideSource(slug);
    expect((await loadGuide(slug)) === "").toBe(hasChapters || !hasText);
  });
});
