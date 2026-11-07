import { cn } from "@/lib/utils";
import { CELL, lettersOf, MARK_BOX, markPaths, TOOLKIT } from "./catalyst-mark";

const LETTERS = lettersOf("CATALYST").map(({ column, rows }) => ({
  ...markPaths(rows, column),
  end: column + Math.max(...rows.map((row) => [...row].length)),
}));

// When each letter is typed, in milliseconds, as a terminal prints the mark: the eight of the mark, then the seven of toolkit, all
// within two thirds of a second, so the mark is whole while the rest of the top still comes in, and the caret is gone by 1.2 s.
const START = 60;
const STEP = 45;
const TOOLKIT_START = START + LETTERS.length * STEP + 40;
const TOOLKIT_STEP = 25;
const BLINK = 530;
const markAt = (i: number) => START + i * STEP;
const toolkitAt = (i: number) => TOOLKIT_START + i * TOOLKIT_STEP;

// The caret after each letter, in cells: as tall as the mark after a letter of it, and a cell after a letter of toolkit.
const caretsOf = (toolkit: boolean) => [
  ...LETTERS.map((letter, i) => ({ x: letter.end, y: 0, height: MARK_BOX.height, at: markAt(i) })),
  ...(toolkit ? TOOLKIT.map(({ column }, i) => ({ x: column + 1, y: MARK_BOX.height, height: CELL.height, at: toolkitAt(i) })) : []),
];

// The part the mark takes in the title that travels from a list to the page it opens (src/lib/view-transition.ts): the item that
// is clicked, or the title of the page.
const TRAVEL = { item: { "data-vt": "title" }, target: { "data-vt-target": "title" } } as const;

// The mark the catalyst draws on its own screen, in its copper, with "toolkit" spaced under its right end, as the casa does. It is a
// picture of the name: whoever cannot see it reads the name from the heading or the link around it. Typed, it shows at once, faint,
// and each letter lights up behind a caret, which blinks once at the end and goes; with reduced motion, it shows whole.
export function CatalystMark({
  className,
  toolkit = true,
  typed = false,
  travel,
}: {
  className?: string;
  toolkit?: boolean;
  typed?: boolean;
  travel?: keyof typeof TRAVEL;
}) {
  const height = MARK_BOX.height + (toolkit ? CELL.height : 0);
  const wait = (at: number) => (typed ? { animationDuration: `${at}ms` } : undefined);
  return (
    <svg aria-hidden viewBox={`0 0 ${MARK_BOX.width} ${height}`} className={cn("block h-auto text-terminal-copper", className)} {...(travel ? TRAVEL[travel] : {})}>
      {LETTERS.map((letter, i) => (
        <g key={i} className={cn(typed && "typed-letter")} style={wait(markAt(i))}>
          <path d={letter.blocks} className="fill-current" />
          <path d={letter.lines} className="fill-none stroke-current [stroke-width:0.7]" />
        </g>
      ))}
      {toolkit && (
        <g data-toolkit className="font-mono font-normal text-muted-foreground">
          {TOOLKIT.map(({ letter, column }, i) => (
            <text
              key={i}
              x={(column + 0.5) * CELL.width}
              y={MARK_BOX.height + CELL.height * 0.78}
              textAnchor="middle"
              fontSize={CELL.height * 0.85}
              className={cn("fill-current", typed && "typed-letter")}
              style={wait(toolkitAt(i))}
            >
              {letter}
            </text>
          ))}
        </g>
      )}
      {typed && (
        <g className="fill-current">
          {caretsOf(toolkit).map((caret, i, all) => {
            const next = all[i + 1];
            return (
              <rect
                key={i}
                className={cn("typed-caret", !next && "typed-caret-last")}
                x={caret.x * CELL.width}
                y={caret.y}
                width={CELL.width}
                height={caret.height}
                style={{ animationDelay: `${caret.at}ms`, animationDuration: `${next ? next.at - caret.at : BLINK}ms` }}
              />
            );
          })}
        </g>
      )}
    </svg>
  );
}
