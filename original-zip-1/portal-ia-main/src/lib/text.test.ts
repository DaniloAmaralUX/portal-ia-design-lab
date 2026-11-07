import { describe, expect, it } from "vitest";
import { fold, slugify } from "./text";

describe("fold", () => {
  it("drops the accents and the case", () => {
    expect(fold("Atenção com Código")).toBe("atencao com codigo");
  });
});

describe("slugify", () => {
  it("turns each stretch that is not a letter or digit into one hyphen, and trims the ends", () => {
    expect(slugify("EF Core")).toBe("ef-core");
    expect(slugify("  Atenção, com (código)!  ")).toBe("atencao-com-codigo");
    expect(slugify("SKILL.md")).toBe("skill-md");
    expect(slugify("---")).toBe("");
  });
});
