import { ArrowUpRight, CirclePlay } from "lucide-react";
import { Button } from "@/design-system/primitives";
import type { Interval } from "@/data/types";
import { cn } from "@/lib/utils";
import { playsEmbedded } from "./plays-embedded";

// The recording plays from SharePoint, with the Microsoft account the person has open in the browser. A browser that keeps the
// cookies of SharePoint from the iframe shows an error in its place, so outside Edge the page offers the recording in SharePoint first.
export function IntervalVideo({ interval, className }: { interval: Pick<Interval, "title" | "video">; className?: string }) {
  const embedded = playsEmbedded(navigator);
  return (
    <figure className={cn(className)}>
      {embedded ? (
        <>
          <div className="aspect-video overflow-hidden rounded-2xl border border-border bg-muted">
            <iframe
              src={interval.video}
              title={`Gravação: ${interval.title}`}
              className="size-full"
              allow="fullscreen; autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
          <figcaption className="mt-3 max-w-measure text-small text-muted-foreground text-pretty">
            Se no lugar do vídeo aparecer um erro ou a tela de login da Microsoft,{" "}
            <a href={interval.video} target="_blank" rel="noreferrer" className="link inline-flex items-center gap-0.5">
              abra a gravação no SharePoint
              <ArrowUpRight aria-hidden className="size-3.5" />
              <span className="sr-only"> (abre em outra aba)</span>
            </a>
            .
          </figcaption>
        </>
      ) : (
        <OutsidePlayer video={interval.video} />
      )}
    </figure>
  );
}

function OutsidePlayer({ video }: { video: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-muted p-6 text-center sm:aspect-video">
      <CirclePlay aria-hidden className="size-10 text-muted-foreground" />
      <p className="max-w-sm text-small leading-relaxed text-foreground/85 text-pretty">
        Neste navegador, a gravação toca no SharePoint, com a sua conta Microsoft.
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <Button asChild>
          <a href={video} target="_blank" rel="noreferrer">
            Assistir no SharePoint
            <ArrowUpRight data-icon="inline-end" aria-hidden />
            <span className="sr-only"> (abre em outra aba)</span>
          </a>
        </Button>
      </div>
    </div>
  );
}
