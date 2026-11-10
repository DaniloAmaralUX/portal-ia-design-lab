export const delay = (step: number) => ({ animationDelay: `${step * 100}ms` });

// The time tokens of globals.css, in milliseconds, for a motion that JavaScript paces. The test keeps the two in step.
export const DURATION = { fast: 120, interaction: 150, base: 200, slow: 300, page: 340 } as const;

export const iconSwap = "transition-[opacity,scale,filter] duration-(--duration-slow) ease-(--ease-out-soft)";
export const iconShown = "scale-100 opacity-100 blur-none";
export const iconHidden = "scale-[0.25] opacity-0 blur-[4px]";

export const press =
  "transition-[color,background-color,border-color,box-shadow,scale] duration-(--duration-interaction) ease-(--ease-out-soft) motion-safe:active:not-focus-visible:scale-[0.96]";
