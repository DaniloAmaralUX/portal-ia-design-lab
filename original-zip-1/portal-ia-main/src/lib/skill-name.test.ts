import { describe, expect, it } from "vitest";
import { exactSkillName, skillNamesIn, splitAtSkillNames } from "./skill-name";

describe("skill names in a text", () => {
  it("finds each name, with hyphens inside it and no trailing punctuation", () => {
    expect(skillNamesIn("Use a pg-revisar-seguranca ou a pg-c4-model, não a pg-.")).toEqual(["pg-revisar-seguranca", "pg-c4-model"]);
  });

  it("does not take a name from the middle of a word", () => {
    expect(skillNamesIn("xpg-nada e /plugin:pg-ok")).toEqual(["pg-ok"]);
  });

  it("cuts the text at each name and keeps the names at the odd positions", () => {
    expect(splitAtSkillNames("a pg-um e pg-dois.")).toEqual(["a ", "pg-um", " e ", "pg-dois", "."]);
  });

  it("takes the name from a text that is only the name, with or without the plugin and the slash", () => {
    expect(exactSkillName("pg-revisar-seguranca")).toBe("pg-revisar-seguranca");
    expect(exactSkillName("/pr-review:pg-revisar-seguranca")).toBe("pg-revisar-seguranca");
    expect(exactSkillName(" pg-um ")).toBe("pg-um");
    expect(exactSkillName("rode pg-um")).toBeUndefined();
    expect(exactSkillName("pg-")).toBeUndefined();
  });
});
