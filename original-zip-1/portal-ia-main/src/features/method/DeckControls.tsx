import * as Dialog from "@radix-ui/react-dialog";
import { BookOpen, ChevronLeft, ChevronRight, Maximize, Minimize } from "lucide-react";
import { Kbd } from "@/components/ui/kbd";
import { iconHidden, iconShown, iconSwap, press } from "@/lib/motion";
import { cn } from "@/lib/utils";

// 36px with a mouse, 44px on a touch screen, where the deck is driven with the thumb. At the ends of the deck a button stays
// focusable (aria-disabled, not disabled): a disabled button drops the focus to the body, out of the deck, and the keys stop.
const control =
  "inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors pointer-coarse:size-11 hover:bg-accent hover:text-foreground aria-disabled:cursor-default aria-disabled:opacity-35 aria-disabled:hover:bg-transparent aria-disabled:hover:text-muted-foreground aria-disabled:active:scale-none";

type Step = { label: string; onClick?: () => void };

export function DeckControls({
  position,
  count,
  title,
  prev,
  next,
  fullscreen,
}: {
  position: number;
  count: number;
  title: string;
  prev: Step;
  next: Step;
  fullscreen: { supported: boolean; active: boolean; toggle: () => void };
}) {
  return (
    <div className="flex shrink-0 items-center gap-3 border-t border-border bg-card px-2 pb-[max(0.375rem,env(safe-area-inset-bottom))] pt-1.5 sm:px-3">
      <div className="flex min-w-0 flex-1 items-center gap-1">
        <button type="button" aria-label={prev.label} title={prev.label} aria-disabled={prev.onClick ? undefined : true} onClick={prev.onClick} className={cn(control, press)}>
          <ChevronLeft aria-hidden className="size-[18px]" />
        </button>
        <p role="status" className="min-w-[10ch] whitespace-nowrap text-center font-mono text-caption tabular-nums text-foreground/85">
          {count ? (
            <>
              {/* Under 400px the four controls of 44px leave the counter room for one line only without the word, which the screen reader still says. */}
              <span className="max-[25rem]:sr-only">Slide </span>
              {position} de {count}
            </>
          ) : (
            "\u00a0"
          )}
        </p>
        <button type="button" aria-label={next.label} title={next.label} aria-disabled={next.onClick ? undefined : true} onClick={next.onClick} className={cn(control, press)}>
          <ChevronRight aria-hidden className="size-[18px]" />
        </button>
        <p className="ml-2 hidden min-w-0 truncate text-caption text-muted-foreground md:block">{title}</p>
      </div>
      <p className="hidden shrink-0 items-center gap-1.5 text-micro text-muted-foreground xl:flex">
        <Kbd>←</Kbd>
        <Kbd>→</Kbd> navegar
        <span aria-hidden>·</span>
        <Kbd>F</Kbd> tela cheia
        <span aria-hidden>·</span>
        <Kbd>Esc</Kbd> sair
      </p>
      <div className="flex shrink-0 items-center gap-1">
        {fullscreen.supported && (
          <button type="button" aria-label="Tela cheia" aria-pressed={fullscreen.active} onClick={fullscreen.toggle} className={cn(control, press)}>
            <span className="grid">
              <Maximize aria-hidden className={cn("col-start-1 row-start-1 size-4", iconSwap, fullscreen.active ? iconHidden : iconShown)} />
              <Minimize aria-hidden className={cn("col-start-1 row-start-1 size-4", iconSwap, fullscreen.active ? iconShown : iconHidden)} />
            </span>
          </button>
        )}
        <Dialog.Close
          aria-label="Voltar à leitura"
          className={cn(
            "inline-flex h-9 min-w-9 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 text-caption font-medium text-foreground shadow-xs pointer-coarse:h-11 pointer-coarse:min-w-11 hover:border-foreground/20",
            press,
          )}
        >
          <BookOpen aria-hidden className="size-3.5 shrink-0" />
          {/* Under 360px the bar has no room for the word; above it the exit says what it does, since a phone has no Esc key. */}
          <span className="max-[22.5rem]:hidden">Leitura</span>
        </Dialog.Close>
      </div>
    </div>
  );
}
