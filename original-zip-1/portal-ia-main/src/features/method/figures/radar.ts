// The geometry of the radar of the retrato, the one the doctor draws: the centre at (280, 240) of a 560 by 450 box, a ring every
// 30 units from N0 to N3, and an axis every 360/7 degrees, clockwise from the top.
export const RADAR_BOX = { width: 560, height: 450 };
const CENTRE = { x: 280, y: 240 };
const RING = 30;
const TICK = 8;
export const TOP_LEVEL = 3;

export type Point = [number, number];

function angleOf(axis: number, axes: number): number {
  return (axis * 2 * Math.PI) / axes;
}

export function radarPoint(level: number, axis: number, axes: number): Point {
  const r = RING * (level + 1);
  const a = angleOf(axis, axes);
  return [CENTRE.x + r * Math.sin(a), CENTRE.y - r * Math.cos(a)];
}

export function pointsOf(points: Point[]): string {
  return points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
}

// The polygon that joins the level of each axis, the line of a round.
export function polygonOf(levels: number[]): Point[] {
  return levels.map((level, axis) => radarPoint(level, axis, levels.length));
}

// A ring is the polygon of the same level on every axis.
export function ringOf(level: number, axes: number): Point[] {
  return Array.from({ length: axes }, (_, axis) => radarPoint(level, axis, axes));
}

// The short mark of the minimum, across the axis.
export function tickOf(level: number, axis: number, axes: number): [Point, Point] {
  const [x, y] = radarPoint(level, axis, axes);
  const a = angleOf(axis, axes);
  const dx = TICK * Math.cos(a);
  const dy = TICK * Math.sin(a);
  return [
    [x - dx, y - dy],
    [x + dx, y + dy],
  ];
}

export function between(from: Point[], to: Point[], k: number): Point[] {
  return from.map(([x, y], i) => {
    const [tx, ty] = to[i] ?? [x, y];
    return [x + (tx - x) * k, y + (ty - y) * k];
  });
}

// The radar of a narrow screen: only the code of each requirement, just out of the last ring, in a box cut around the drawing.
export const COMPACT_BOX = { x: 76, y: 78, width: 408, height: 308 };
const COMPACT_LABEL_RADIUS = 138;

type Anchor = "start" | "middle" | "end";
const NUDGE: Record<Anchor, number> = { start: 4, middle: 0, end: -4 };

export function compactLabelOf(axis: number, axes: number): { x: number; y: number; anchor: Anchor } {
  const a = angleOf(axis, axes);
  const [sin, cos] = [Math.sin(a), Math.cos(a)];
  const anchor: Anchor = Math.abs(sin) < 0.2 ? "middle" : sin > 0 ? "start" : "end";
  // The baseline sits above a label at the top, below one at the bottom, and halfway on the sides.
  const baseline = cos > 0.95 ? -6 : cos < -0.5 ? 14 : 5;
  return { x: CENTRE.x + COMPACT_LABEL_RADIUS * sin + NUDGE[anchor], y: CENTRE.y - COMPACT_LABEL_RADIUS * cos + baseline, anchor };
}

// Where the doctor writes the name of each level, beside the axis of R1.
export const RING_LABELS: { level: number; x: number; y: number }[] = [
  { level: 0, x: 295.5, y: 216.5 },
  { level: 1, x: 308.5, y: 189.4 },
  { level: 2, x: 321.6, y: 162.4 },
  { level: 3, x: 334.6, y: 135.4 },
];

// Where the doctor writes the code and the name of each requirement, out of the last ring.
export const AXIS_LABELS: { x: number; y: number; anchor: "start" | "middle" | "end"; lines: string[] }[] = [
  { x: 280, y: 63, anchor: "middle", lines: ["Contexto técnico", "legível"] },
  { x: 399.5, y: 156.7, anchor: "start", lines: ["Base de conhecimento", "do produto"] },
  { x: 426.5, y: 275.2, anchor: "start", lines: ["Arquitetura com", "fronteiras explícitas"] },
  { x: 350.7, y: 370.1, anchor: "start", lines: ["Rede de testes"] },
  { x: 209.3, y: 370.1, anchor: "end", lines: ["Observabilidade que", "aponta causa"] },
  { x: 133.5, y: 275.2, anchor: "end", lines: ["Pipeline e", "reversibilidade"] },
  { x: 160.5, y: 156.7, anchor: "end", lines: ["Segurança, dados e", "escopo do agente"] },
];
