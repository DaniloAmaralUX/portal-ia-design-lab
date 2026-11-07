import { describe, expect, it } from "vitest";
import { formatDuration, oneOf, plural } from "@/lib/utils";

const nbsp = "\u00a0";

describe("formatDuration", () => {
  it("keeps each number together with its unit", () => {
    expect(formatDuration(750)).toBe(`12${nbsp}h 30${nbsp}min`);
    expect(formatDuration(120)).toBe(`2${nbsp}h`);
    expect(formatDuration(45)).toBe(`45${nbsp}min`);
  });
});

describe("plural", () => {
  it("picks the word from the number and keeps the two together", () => {
    expect(plural(1, "aula", "aulas")).toBe(`1${nbsp}aula`);
    expect(plural(9, "aula", "aulas")).toBe(`9${nbsp}aulas`);
    expect(plural(0, "skill", "skills")).toBe(`0${nbsp}skills`);
  });
});

describe("oneOf", () => {
  const modes = ["auto", "manual"] as const;

  it("returns the value when it is one of the allowed ones", () => {
    expect(oneOf("manual", modes)).toBe("manual");
  });

  it("returns undefined for a value that is not allowed, whatever its type", () => {
    for (const value of ["", "Manual", "toString", "__proto__", 1, null, undefined, ["auto"], { auto: true }]) expect(oneOf(value, modes)).toBeUndefined();
  });
});
