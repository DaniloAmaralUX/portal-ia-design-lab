import { useId, useRef, useState, type ReactNode } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";

export function Acronym({ tip, children, as: Element = "abbr" }: { tip: string; children: ReactNode; as?: "abbr" | "span" }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const touchState = useRef({ active: false, wasOpen: false });
  return (
    <>
      <Tooltip.Root open={open} onOpenChange={setOpen}>
        <Tooltip.Trigger asChild>
          <Element
            className="acronym"
            tabIndex={0}
            aria-describedby={id}
            onPointerDown={(event) => {
              touchState.current = { active: event.pointerType === "touch", wasOpen: open };
              if (touchState.current.active) event.preventDefault();
            }}
            onClick={(event) => {
              if (!touchState.current.active) return;
              event.preventDefault();
              setOpen(!touchState.current.wasOpen);
            }}
          >
            {children}
          </Element>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            sideOffset={6}
            collisionPadding={16}
            className="animate-overlay-in z-[90] max-w-[min(20rem,calc(100vw-2.5rem))] rounded-md border border-border bg-popover px-2.5 py-2 text-caption leading-[1.45] text-popover-foreground shadow-lg"
          >
            {tip}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
      <span id={id} hidden>
        {tip}
      </span>
    </>
  );
}
