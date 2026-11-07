import { describe, expect, it } from "vitest";
import { PAGES } from "./pages";

describe("the pages with a fixed address", () => {
  it("are listed once, so the search and the browser tests open each one a single time", () => {
    const keys = PAGES.map((page) => (page.params ? `${page.to}:${page.params.area}` : page.to));
    expect(new Set(keys).size).toBe(keys.length);
  });
});
