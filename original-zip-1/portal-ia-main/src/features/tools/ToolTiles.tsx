import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { AI_LOGOS, type AiLogo } from "./ai-logos";

type Mark = keyof typeof AI_LOGOS;

// The mark of each tile, where it stands around the top, its tilt, and its float: the seconds of each half swing, where in the swing
// it starts and how far it goes up and down, all a little different, so no two tiles move together. Four to a side, in two columns,
// the one at the edge and the one nearer the title, so that two tiles in a row never share a column; from the top down, one side and
// then the other, the ones in colors apart from each other.
const TILES: { mark: Mark; place: string; tilt: number; period: number; phase: number; lift: number }[] = [
  { mark: "Claude", place: "top-0 left-[4.5rem] xl:left-24", tilt: -9, period: 8, phase: -1, lift: 5 },
  { mark: "OpenAI", place: "top-[6%] right-[4.5rem] xl:right-24", tilt: 8, period: 9.5, phase: -4, lift: 4 },
  { mark: "Cursor", place: "top-[24%] left-0", tilt: 4, period: 7, phase: -2.5, lift: 6 },
  { mark: "Google Gemini", place: "top-[30%] right-0", tilt: -3, period: 8.5, phase: -6, lift: 5 },
  { mark: "Antigravity", place: "top-[48%] left-[4.5rem] xl:left-24", tilt: -6, period: 10, phase: -3, lift: 4 },
  { mark: "Grok", place: "top-[54%] right-[4.5rem] xl:right-24", tilt: 5, period: 7.5, phase: -5, lift: 6 },
  { mark: "OpenCode", place: "top-[72%] left-0", tilt: 7, period: 9, phase: -7, lift: 5 },
  { mark: "Windsurf", place: "top-[76%] right-0", tilt: -5, period: 6.5, phase: -2, lift: 4 },
];

// Where the tiles go: around the top on a wide screen, where they have room beside the title, and on a narrower one in a quiet row
// between the sentence and the cards, smaller, in two rows of four on a phone.
const LAYOUT = {
  around: {
    box: "pointer-events-none absolute inset-0 hidden select-none lg:block xl:-inset-x-12",
    tile: "absolute size-16 rounded-2xl",
    art: "size-8",
  },
  row: {
    box: "pointer-events-none mx-auto mt-8 grid w-fit select-none grid-cols-4 gap-x-3 gap-y-4 sm:grid-cols-8 lg:hidden",
    tile: "size-12 rounded-xl",
    art: "size-6",
  },
} as const;

function MarkArt({ mark, className }: { mark: Mark; className: string }) {
  const logo: AiLogo = AI_LOGOS[mark];
  if ("src" in logo) return <img src={logo.src} alt="" width={logo.width} height={logo.height} className={cn("block", className)} />;
  return (
    <svg viewBox={logo.viewBox ?? "0 0 24 24"} className={cn("fill-current", logo.tone, className)}>
      <path d={logo.path} fillRule={logo.evenOdd ? "evenodd" : undefined} />
    </svg>
  );
}

// The tiles of Ferramentas, with the marks of the agents of AI a project gets ready for: a picture, with nothing to read nor to
// reach, and no word on which agents a tool works with, which its own page says. They come in after the title and float on, slowly.
export function ToolTiles({ layout, arrive }: { layout: keyof typeof LAYOUT; arrive: boolean }) {
  const { box, tile, art } = LAYOUT[layout];
  return (
    <div aria-hidden data-tiles={layout} className={box}>
      {TILES.map(({ mark, place, tilt, period, phase, lift }, i) => (
        <div
          key={mark}
          data-logo={mark}
          data-arrive={arrive ? "" : undefined}
          className={cn("tool-tile grid place-items-center border border-border bg-card shadow-md", tile, layout === "around" && place)}
          style={
            {
              rotate: `${tilt}deg`,
              "--tile-delay": `${200 + i * 60}ms`,
              "--tile-period": `${period}s`,
              "--tile-phase": `${phase}s`,
              "--tile-lift": `${lift}px`,
            } as CSSProperties
          }
        >
          <MarkArt mark={mark} className={art} />
        </div>
      ))}
    </div>
  );
}
