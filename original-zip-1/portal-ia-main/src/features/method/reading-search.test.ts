import { describe, expect, it } from "vitest";
import { validateReadingSearch } from "./reading-search";

describe("the reading mode in the address", () => {
  it("opens the presentation on the slide of the link", () => {
    expect(validateReadingSearch({ modo: "apresentacao", slide: 3 })).toEqual({ modo: "apresentacao", slide: 3 });
    expect(validateReadingSearch({ modo: "apresentacao", slide: "4" })).toEqual({ modo: "apresentacao", slide: 4 });
    expect(validateReadingSearch({ modo: "apresentacao", slide: "ultimo" })).toEqual({ modo: "apresentacao", slide: "ultimo" });
  });

  it("starts from the first slide when the number is not one, and reads when the mode is unknown", () => {
    expect(validateReadingSearch({ modo: "apresentacao", slide: "dois" })).toEqual({ modo: "apresentacao", slide: undefined });
    expect(validateReadingSearch({ modo: "apresentacao", slide: 0 })).toEqual({ modo: "apresentacao", slide: undefined });
    expect(validateReadingSearch({ modo: "slides", slide: 2 })).toEqual({ modo: undefined, slide: undefined });
    expect(validateReadingSearch({})).toEqual({ modo: undefined, slide: undefined });
  });
});
