import { useCallback } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { PRESENTING } from "./reading-search";

// The presentation of the page, read from the address and written back to it. Each slide replaces the history entry, so the
// back button leaves the presentation instead of walking the slides.
export function usePresentation() {
  const { modo, slide } = useSearch({ strict: false });
  const navigate = useNavigate();
  const go = useCallback(
    (n: number) => void navigate({ to: ".", search: (prev) => ({ ...prev, modo: PRESENTING, slide: n }), replace: true, resetScroll: false }),
    [navigate],
  );
  // Leaving goes back to the text on the section the slide showed, so the reading picks up where the presentation was.
  const exit = useCallback(
    (id: string | null) =>
      void navigate({ to: ".", search: (prev) => ({ ...prev, modo: undefined, slide: undefined }), hash: id ?? undefined, replace: true, resetScroll: false }),
    [navigate],
  );
  return { presenting: modo === PRESENTING, slide: slide ?? 1, go, exit };
}
