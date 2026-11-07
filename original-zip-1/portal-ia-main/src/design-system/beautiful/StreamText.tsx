import { useEffect, useRef, useState } from "react";
export function StreamText({ text, onProgress, onDone }: { text: string; onProgress?: () => void; onDone?: () => void }) {
  const [length, setLength] = useState(0);
  const callbacks = useRef({ onProgress, onDone });
  useEffect(() => { callbacks.current = { onProgress, onDone }; });
  useEffect(() => {
    let at = 0;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setInterval(() => { at = reduced ? text.length : Math.min(text.length, at + 3); setLength(at); callbacks.current.onProgress?.(); if (at === text.length) { clearInterval(timer); callbacks.current.onDone?.(); } }, 24);
    return () => clearInterval(timer);
  }, [text]);
  return <>{text.slice(0, length)}</>;
}
