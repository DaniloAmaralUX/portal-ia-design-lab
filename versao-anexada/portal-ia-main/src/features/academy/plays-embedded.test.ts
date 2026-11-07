import { describe, expect, it } from "vitest";
import { playsEmbedded } from "./plays-embedded";

const EDGE = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 Edg/141.0.0.0";
const CHROME = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36";
const FIREFOX = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:144.0) Gecko/20100101 Firefox/144.0";
const SAFARI = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15";

describe("playsEmbedded", () => {
  it("plays the recording in the page only in Edge, by the brands of the browser", () => {
    expect(playsEmbedded({ userAgent: EDGE, userAgentData: { brands: [{ brand: "Microsoft Edge" }, { brand: "Chromium" }] } })).toBe(true);
    expect(playsEmbedded({ userAgent: CHROME, userAgentData: { brands: [{ brand: "Google Chrome" }, { brand: "Chromium" }] } })).toBe(false);
  });

  it("falls back to the user agent where the browser has no brands", () => {
    expect(playsEmbedded({ userAgent: EDGE })).toBe(true);
    expect(playsEmbedded({ userAgent: FIREFOX })).toBe(false);
    expect(playsEmbedded({ userAgent: SAFARI })).toBe(false);
  });
});
