import { TextMorph } from "torph/react";
import { useCraft } from "./craft-context";

export function FeedbackText({ children, instant = false }: { children: string; instant?: boolean }) {
  const { duration } = useCraft();
  return <TextMorph duration={duration} locale="pt-BR" disabled={instant} respectReducedMotion scale={false}>{children}</TextMorph>;
}
