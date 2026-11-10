import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

async function writeClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    try {
      document.body.appendChild(area);
      area.select();
      return document.execCommand("copy");
    } catch {
      return false;
    } finally {
      area.remove();
      if (previous?.isConnected) previous.focus({ preventScroll: true });
    }
  }
}

export function useCopy(message = "Copiado para a área de transferência") {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      const ok = await writeClipboard(text);
      if (!ok) {
        toast.error("Não deu para copiar. Selecione o texto e copie à mão.", {
          id: "copy-error",
          duration: Infinity,
          closeButton: true,
          onDismiss: () => {
            if (trigger?.isConnected) trigger.focus();
          },
        });
        return false;
      }
      toast.success(message);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1600);
      return true;
    },
    [message],
  );

  return { copied, copy };
}
