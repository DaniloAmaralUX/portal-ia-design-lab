import { describe, expect, it } from "vitest";
import { REQUIREMENTS } from "./catalyst-example";
import { between, compactLabelOf, pointsOf, polygonOf, radarPoint, ringOf, tickOf } from "./radar";

const levels = (round: "before" | "after") => REQUIREMENTS.map((r) => r[round]);

describe("the radar of the retrato", () => {
  it("draws the rounds of the example project on the points the doctor's page draws", () => {
    expect(pointsOf(polygonOf(levels("after")))).toBe("280.0,150.0 326.9,202.6 367.7,260.0 306.0,294.1 254.0,294.1 221.5,253.4 209.6,183.9");
    expect(pointsOf(polygonOf(levels("before")))).toBe("280.0,180.0 326.9,202.6 367.7,260.0 306.0,294.1 254.0,294.1 221.5,253.4 233.1,202.6");
  });

  it("puts N0 at 30 units from the centre and N3 at 120, on the axis of R1 at the top", () => {
    expect(radarPoint(0, 0, 7)).toEqual([280, 210]);
    expect(pointsOf(ringOf(3, 7))).toBe("280.0,120.0 373.8,165.2 397.0,266.7 332.1,348.1 227.9,348.1 163.0,266.7 186.2,165.2");
  });

  it("marks the minimum with a short line across the axis", () => {
    const [from, to] = tickOf(2, 0, 7);
    expect(pointsOf([from, to])).toBe("272.0,150.0 288.0,150.0");
  });

  it("moves from one round to the other along the way, and lands on the target", () => {
    const from = polygonOf(levels("before"));
    const to = polygonOf(levels("after"));
    expect(between(from, to, 0)).toEqual(from);
    expect(between(from, to, 1)).toEqual(to);
    expect(pointsOf(between(from, to, 0.5)).split(" ")[0]).toBe("280.0,165.0");
  });

  it("writes the code of an axis on the side the axis points to, in the radar of a narrow screen", () => {
    expect(REQUIREMENTS.map((_, axis) => compactLabelOf(axis, 7).anchor)).toEqual(["middle", "start", "start", "start", "end", "end", "end"]);
  });
});
