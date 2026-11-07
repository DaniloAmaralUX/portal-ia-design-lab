import { useMemo, useState, type ReactNode } from "react";
import { WindowDots } from "@/components/WindowDots";
import { press } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { REQUIREMENTS, type Round } from "./catalyst-example";
import {
  AXIS_LABELS,
  COMPACT_BOX,
  RADAR_BOX,
  RING_LABELS,
  TOP_LEVEL,
  compactLabelOf,
  pointsOf,
  polygonOf,
  radarPoint,
  ringOf,
  tickOf,
  type Point,
} from "./radar";
import { useTween } from "./use-tween";

const ROUNDS: Record<Round, string> = { before: "Antes do init", after: "Depois do init" };
const OTHER: Record<Round, Round> = { before: "after", after: "before" };
const AXES = REQUIREMENTS.length;
const levelsOf = (round: Round) => REQUIREMENTS.map((r) => r[round]);
const FULL_BOX = { x: 0, y: 0, ...RADAR_BOX };

function Shapes({ round, points, compact }: { round: Round; points: Point[]; compact: boolean }) {
  const ghost = useMemo(() => pointsOf(polygonOf(levelsOf(OTHER[round]))), [round]);
  return (
    <>
      {Array.from({ length: TOP_LEVEL + 1 }, (_, level) => (
        <polygon key={level} points={pointsOf(ringOf(level, AXES))} className="fill-none stroke-muted-foreground/40" />
      ))}
      {REQUIREMENTS.map((r, axis) => {
        const [x, y] = radarPoint(TOP_LEVEL, axis, AXES);
        return <line key={r.code} x1={280} y1={240} x2={x} y2={y} className="stroke-muted-foreground/40" />;
      })}
      {RING_LABELS.map(({ level, x, y }) => (
        <text
          key={level}
          x={x}
          y={y}
          className={cn("fill-muted-foreground stroke-card font-bold [paint-order:stroke] [stroke-linejoin:round] [stroke-width:3px]", compact ? "text-[13px]" : "text-[11px]")}
        >
          N{level}
        </text>
      ))}
      {REQUIREMENTS.map((r, axis) => {
        const [[x1, y1], [x2, y2]] = tickOf(r.minimum, axis, AXES);
        return <line key={r.code} x1={x1} y1={y1} x2={x2} y2={y2} className="stroke-muted-foreground stroke-2 [stroke-linecap:round]" />;
      })}
      <polygon points={ghost} className="fill-none stroke-muted-foreground/70 stroke-[1.5] [stroke-linejoin:round]" />
      <polygon points={pointsOf(points)} className="fill-none stroke-foreground stroke-[2.2] [stroke-linejoin:round]" />
      {points.map(([x, y], axis) => (
        <circle key={axis} cx={x} cy={y} r={5} className="fill-foreground stroke-card stroke-2" />
      ))}
    </>
  );
}

// The radar whole, with the name of each requirement, from a box of 512 px; below that, only the codes, and the names go under it.
function Radar({ round, points, label, compact, className }: { round: Round; points: Point[]; label: string; compact: boolean; className?: string }) {
  const box = compact ? COMPACT_BOX : FULL_BOX;
  const levels = REQUIREMENTS.map((r) => `${r.code} em N${r[round]}`).join(", ");
  return (
    <svg
      role="img"
      aria-label={`${label}. ${ROUNDS[round]}: ${levels}.`}
      viewBox={`${box.x} ${box.y} ${box.width} ${box.height}`}
      className={cn("mx-auto h-auto w-full in-[.slide-text]:max-h-[58vh]", compact ? "max-w-[26rem]" : "max-w-[38rem]", className)}
    >
      <Shapes round={round} points={points} compact={compact} />
      {REQUIREMENTS.map((r, axis) => {
        const code = `${r.code} · N${r[round]}`;
        if (compact) {
          const { x, y, anchor } = compactLabelOf(axis, AXES);
          return (
            <text key={r.code} x={x} y={y} textAnchor={anchor} className="fill-foreground text-[16px] font-bold">
              {code}
            </text>
          );
        }
        const place = AXIS_LABELS[axis];
        if (!place) return null;
        return (
          <text key={r.code} x={place.x} y={place.y} textAnchor={place.anchor}>
            <tspan className="fill-foreground text-[13px] font-bold">{code}</tspan>
            {place.lines.map((line, i) => (
              <tspan key={line} x={place.x} dy={i === 0 ? 15 : 14} className="fill-muted-foreground text-[12px]">
                {line}
              </tspan>
            ))}
          </text>
        );
      })}
    </svg>
  );
}

function Key({ children, line }: { children: ReactNode; line: ReactNode }) {
  return (
    <li className="grid grid-cols-[1.75rem_minmax(0,1fr)] items-center gap-3">
      <svg viewBox="0 0 28 16" aria-hidden className="h-4 w-7 overflow-visible">
        {line}
      </svg>
      <span>{children}</span>
    </li>
  );
}

function Controls({ round, onRound }: { round: Round; onRound: (round: Round) => void }) {
  return (
    <div className="mt-5 flex flex-col gap-5 @2xl:flex-row @2xl:items-start @2xl:justify-between @4xl:mt-0 @4xl:flex-col @4xl:justify-start">
      <div
        role="group"
        aria-label="Rodada do radar"
        className="inline-flex shrink-0 items-center gap-0.5 self-start rounded-[calc(var(--radius-md)+0.125rem)] border border-border bg-background p-0.5 text-caption font-medium"
      >
        {(["before", "after"] as const).map((r) => (
          <button
            key={r}
            type="button"
            aria-pressed={round === r}
            onClick={() => onRound(r)}
            className={cn("rounded-md px-3 py-1", round === r ? "bg-foreground text-background" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground", press)}
          >
            {ROUNDS[r]}
          </button>
        ))}
      </div>
      <ul className="grid max-w-sm gap-2 text-caption text-muted-foreground">
        <Key
          line={
            <>
              <line x1="2" y1="8" x2="26" y2="8" className="stroke-foreground stroke-[2.2]" />
              <circle cx="14" cy="8" r="4.5" className="fill-foreground stroke-card stroke-2" />
            </>
          }
        >
          Nível de cada requisito na rodada escolhida.
        </Key>
        <Key line={<line x1="2" y1="8" x2="26" y2="8" className="stroke-muted-foreground/70 stroke-[1.5]" />}>A outra rodada, para comparar.</Key>
        <Key
          line={
            <>
              <line x1="2" y1="8" x2="26" y2="8" className="stroke-muted-foreground/60" />
              <line x1="14" y1="1" x2="14" y2="15" className="stroke-muted-foreground stroke-2 [stroke-linecap:round]" />
            </>
          }
        >
          Mínimo que o padrão pede do requisito.
        </Key>
        <Key line={<line x1="2" y1="8" x2="26" y2="8" className="stroke-muted-foreground stroke-[1.5] [stroke-dasharray:4_3]" />}>
          Sem nível: o raio vai tracejado até a borda, sem ponto.
        </Key>
      </ul>
    </div>
  );
}

// The radar of the retrato the doctor writes, on the page it opens in the browser: the example project before and after the
// init, the round on show, and the other one behind it, to compare. The switch is the one of the doctor's page. On a slide the
// figure keeps the radar, its switch and its key, and leaves the frame of the page out, to fit the screen.
export function CatalystRadar({ label }: { label: string }) {
  const [round, setRound] = useState<Round>("after");
  const [still] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const target = useMemo(() => polygonOf(levelsOf(round)), [round]);
  const tween = useTween(target);
  const points = still ? target : tween;
  return (
    <figure className="@container overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
      <div className="flex items-center gap-2 border-b border-border bg-muted/60 px-4 py-2.5 in-[.slide-text]:hidden">
        <WindowDots />
        <span className="ml-2 min-w-0 truncate rounded-md border border-border bg-card px-2.5 py-0.5 font-mono text-micro text-muted-foreground">
          file:///…/pedidos-api/<span className="text-foreground">.catalyst/diagnostic/index.html</span>
        </span>
      </div>
      <div className="px-4 pb-5 pt-4 @lg:px-7 @lg:pb-6">
        {/* The head of the doctor's page, in divs: it is the frame of the figure, and not text the deck sizes a slide by. */}
        <div className="border-b border-border pb-4 in-[.slide-text]:hidden">
          <div className="eyebrow">catalyst doctor · diagnóstico AI-maintainable</div>
          <div className="mt-1.5 font-display text-heading font-extrabold">Retrato do projeto</div>
          <div className="mt-1 text-caption text-muted-foreground">
            Auditoria de leitura: o catalyst abriu arquivos e consultou o git, e não executou nada do projeto.
          </div>
        </div>
        <div className="mt-4 @4xl:grid @4xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] @4xl:items-center @4xl:gap-8 in-[.slide-text]:mt-0">
          <div>
            <Radar round={round} points={points} label={label} compact className="block @lg:hidden" />
            <Radar round={round} points={points} label={label} compact={false} className="hidden @lg:block" />
            <ol className="mt-4 grid gap-1 text-caption @lg:hidden">
              {REQUIREMENTS.map((r) => (
                <li key={r.code} className="grid grid-cols-[2rem_minmax(0,1fr)_auto] gap-2">
                  <span className="font-semibold text-foreground">{r.code}</span>
                  <span className="text-muted-foreground">{r.name}</span>
                  <span className="font-semibold tabular-nums text-foreground">N{r[round]}</span>
                </li>
              ))}
            </ol>
          </div>
          <Controls round={round} onRound={setRound} />
        </div>
      </div>
    </figure>
  );
}
