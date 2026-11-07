import { useRef, useState } from "react";
import { CatalystMark } from "@/components/CatalystMark";
import type { Guide } from "@/data/guides";
import { useIntro } from "@/hooks/use-intro";
import { delay } from "@/lib/motion";
import { travelling } from "@/lib/view-transition";
import { cn } from "@/lib/utils";
import { RotatingWord } from "./RotatingWord";
import { ToolInstallBar } from "./ToolInstallBar";
import { ToolVideo } from "./ToolVideo";

// The top of the page of a tool, as the top of a product: the name once, in the mark of the catalyst typed in big; the line that
// says what it prepares the project for, with the word that changes; what it does in a sentence; the bar of the install; and the
// tool at work, in a video. It takes the width of the page, centered, with no trail above it: the tab at the top says where the page
// is.
export function ToolHero({ guide }: { guide: Guide }) {
  useIntro();
  const top = useRef<HTMLElement>(null);
  const [stopped, setStopped] = useState(false);
  // The mark that travels in from the card of Ferramentas arrives whole, and does not type itself or rise over again.
  const [typed] = useState(() => travelling()?.direction !== "forward");
  const intro = "animate-intro";
  return (
    <header ref={top}>
      <div className="mx-auto flex max-w-4xl flex-col items-center pt-12 text-center sm:pt-20">
        {/* The mark comes in by its own typing, over letters that are there from the first paint; under a fade it would wait hidden. */}
        <h1 className="w-full">
          <span className="sr-only">{guide.label}</span>
          <CatalystMark typed={typed} travel="target" className="mx-auto w-full max-w-[42rem]" />
        </h1>
        <p className={cn("mt-8 font-display text-headline font-bold text-balance", intro)} style={delay(1)}>
          Deixa o seu projeto pronto para <RotatingWord gate={top} stopped={stopped} />
        </p>
        {/* The sentence is the biggest text of the top, the paint the LCP counts, so it shows at once: Chrome takes a text that comes
            in from transparent only when it paints again, a second later, when the intro ends. */}
        <p className="mt-5 max-w-2xl text-lead leading-relaxed text-muted-foreground text-pretty">{guide.summary}</p>
        <div className={cn("mt-9 w-full max-w-[46rem]", intro)} style={delay(2)}>
          <ToolInstallBar />
        </div>
      </div>
      <ToolVideo stopped={stopped} onToggle={() => setStopped((s) => !s)} className={cn("mx-auto mt-14 max-w-4xl", intro)} />
    </header>
  );
}
