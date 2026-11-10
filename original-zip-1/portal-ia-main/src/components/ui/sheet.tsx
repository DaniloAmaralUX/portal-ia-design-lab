import { useRef, useState, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useReturnFocus } from "@/hooks/use-return-focus";
import { cn, scrollActiveIntoView } from "@/lib/utils";
import { IconButton } from "./icon-button";

export function Sheet({
  open,
  onClose,
  title,
  children,
  size = "sm",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "sm" | "lg";
}) {
  const returnFocus = useReturnFocus();
  const scroll = useRef<HTMLDivElement>(null);
  const [byLink, setByLink] = useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay data-drawer data-dead-end={byLink || undefined} className="animate-overlay-in fixed inset-0 z-[70] bg-black/45 backdrop-blur-sm" />
        <Dialog.Content
          aria-describedby={undefined}
          {...returnFocus}
          data-dead-end={byLink || undefined}
          onClickCapture={(e) => {
            const link = e.target instanceof Element ? e.target.closest<HTMLAnchorElement>("a[href]") : null;
            setByLink(Boolean(link && link.pathname !== window.location.pathname));
          }}
          onOpenAutoFocus={() => {
            setByLink(false);
            returnFocus.onOpenAutoFocus();
            requestAnimationFrame(() => scroll.current && scrollActiveIntoView(scroll.current));
          }}
          className={cn(
            "animate-sheet-in fixed right-0 top-0 z-[71] flex h-full flex-col border-l border-border bg-background shadow-xl outline-none",
            size === "lg" ? "w-[min(94vw,760px)]" : "w-[min(88vw,380px)]",
          )}
        >
          <div className="flex h-16 items-center justify-between gap-3 border-b border-border px-5">
            <Dialog.Title className={size === "lg" ? "min-w-0 truncate font-mono text-small font-medium" : "text-small font-semibold"}>
              {title}
            </Dialog.Title>
            <Dialog.Close asChild>
              <IconButton label="Fechar" size="sm"><X aria-hidden className="size-4" /></IconButton>
            </Dialog.Close>
          </div>
          <div ref={scroll} className="flex-1 overflow-y-auto overscroll-contain p-5">
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
