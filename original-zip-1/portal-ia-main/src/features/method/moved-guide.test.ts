import { describe, expect, it } from "vitest";
import { movedTarget } from "./moved-guide";

describe("the address of a guide that moved", () => {
  it("lands the old page of the guide on the page of the product", () => {
    expect(movedTarget("catalyst", "/metodo/catalyst")).toEqual({ guide: "catalyst-toolkit", chapter: null });
    expect(movedTarget("catalyst", "/metodo/catalyst/")).toEqual({ guide: "catalyst-toolkit", chapter: null });
  });

  it("lands each old chapter on the chapter that took its place, and the rest on how it works", () => {
    expect(movedTarget("catalyst", "/metodo/catalyst/doctor")).toEqual({ guide: "catalyst-toolkit", chapter: "doctor" });
    expect(movedTarget("catalyst", "/metodo/catalyst/experimente")).toEqual({ guide: "catalyst-toolkit", chapter: "instalar" });
    expect(movedTarget("catalyst", "/metodo/catalyst/chat")).toEqual({ guide: "catalyst-toolkit", chapter: "o-que-faz" });
  });

  it("leaves a guide that did not move where it is", () => {
    expect(movedTarget("sdd", "/metodo/sdd")).toBeNull();
    expect(movedTarget("toString", "/metodo/toString")).toBeNull();
  });
});
