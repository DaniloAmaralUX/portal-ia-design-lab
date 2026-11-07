import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { DURATION } from "../src/lib/motion.ts";

describe("the time tokens", () => {
  it("are the ones of globals.css, so a motion that JavaScript paces keeps the time of the rest of the site", () => {
    const css = readFileSync(new URL("../src/styles/globals.css", import.meta.url), "utf8");
    const tokens = Object.fromEntries([...css.matchAll(/--duration-(\w+):\s*(\d+)ms/g)].map(([, name, ms]): [string, number] => [name ?? "", Number(ms)]));
    expect(tokens).toEqual(DURATION);
  });
});
