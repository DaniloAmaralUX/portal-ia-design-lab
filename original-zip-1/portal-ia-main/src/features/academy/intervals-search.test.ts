import { describe, expect, it } from "vitest";
import { areas } from "@/data/areas";
import { validateIntervalsSearch } from "./intervals-search";

describe("shared Academy filter links", () => {
  it("restores an area from a shared URL", () => {
    const area = areas[0]!.id;
    expect(validateIntervalsSearch({ area })).toEqual({ area });
  });

  it("ignores missing, unknown and non-string filters", () => {
    for (const area of [undefined, "unknown", "", 1, [areas[0]!.id], { value: areas[0]!.id }]) {
      expect(validateIntervalsSearch({ area })).toEqual({ area: undefined });
    }
  });
});
