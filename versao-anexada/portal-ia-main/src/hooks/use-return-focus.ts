import { useRef } from "react";

export function useReturnFocus() {
  const origin = useRef<{ element: HTMLElement | null; path: string }>({ element: null, path: "" });

  return {
    onOpenAutoFocus: () => {
      const active = document.activeElement;
      origin.current = { element: active instanceof HTMLElement ? active : null, path: location.pathname };
    },
    onCloseAutoFocus: (event: Event) => {
      event.preventDefault();
      if (location.pathname === origin.current.path) origin.current.element?.focus();
    },
  };
}
