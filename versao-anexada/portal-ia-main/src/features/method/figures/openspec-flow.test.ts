import { describe, expect, it } from "vitest";
import { FLOW_STEPS } from "./openspec-flow";
import type { Part } from "./terminal-screen";

const textOf = (part: Part): string => (typeof part === "string" ? part : part.text);

describe("the flow of a change in OpenSpec", () => {
  it("walks the stages of the guide in order, and stops at the two gates", () => {
    expect(FLOW_STEPS.map((s) => s.node)).toEqual([
      "prompt-mestre",
      "/opsx:explore",
      "/opsx:propose",
      "o plano está certo?",
      "/opsx:apply",
      "/opsx:verify",
      "/opsx:archive",
    ]);
    expect(FLOW_STEPS.filter((s) => s.gate).map((s) => s.node)).toEqual(["o plano está certo?", "/opsx:archive"]);
  });

  it("gives the person the review and the archive, and the planning to the strongest model", () => {
    const actors = FLOW_STEPS.map((s) => s.actor);
    expect(actors).toEqual(["you", "strong", "strong", "you", "fast", "fast", "you"]);
  });

  it("shows in each terminal the command of its step", () => {
    for (const step of FLOW_STEPS.filter((s) => s.command.startsWith("/"))) {
      const screen = step.screen.lines.map((line) => line.map(textOf).join("")).join("\n");
      expect(screen, step.node).toContain(step.command);
    }
  });

  it("marks at least one file or folder in every step that writes something", () => {
    const quiet = FLOW_STEPS.filter((s) => !s.tree.some((line) => line.hot)).map((s) => s.node);
    expect(quiet).toEqual(["/opsx:explore"]);
  });
});
