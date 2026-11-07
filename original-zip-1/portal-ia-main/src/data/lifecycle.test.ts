import { describe, expect, it } from "vitest";
import { plugins } from "./catalog";
import { LIFECYCLES } from "./lifecycle";

describe("the states a plugin can declare", () => {
  it("are the four of the skills repository, and retired is not one: a retired plugin leaves the marketplace", () => {
    expect(Object.keys(LIFECYCLES)).toEqual(["experimental", "incubating", "supported", "deprecated"]);
    expect(LIFECYCLES).not.toHaveProperty("retired");
  });

  it("give every plugin of the catalog a label and a meaning", () => {
    for (const plugin of plugins) {
      expect(LIFECYCLES[plugin.lifecycle], plugin.name).toBeDefined();
      expect(LIFECYCLES[plugin.lifecycle].label, plugin.name).toBeTruthy();
      expect(LIFECYCLES[plugin.lifecycle].means, plugin.name).toBeTruthy();
    }
  });
});
