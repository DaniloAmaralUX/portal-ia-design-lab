import { Presentation, type PresentationProps } from "./Presentation";
import { usePresentation } from "./use-presentation";

// The presentation of a page, open while the address asks for it. Its code comes with the page (a few kilobytes), so the
// switch opens it at once.
export function PresentationHost(props: PresentationProps) {
  const { presenting, slide, go, exit } = usePresentation();
  return presenting ? <Presentation {...props} slide={slide} onGo={go} onExit={exit} /> : null;
}
