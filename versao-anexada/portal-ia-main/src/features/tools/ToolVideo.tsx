import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { CASA_VIDEO } from "./tool-video";

const LABEL =
  'A casa do catalyst num projeto de exemplo: a marca CATALYST em blocos, o projeto e o ramo, a linha "Último diagnóstico há 2 dias · indeterminada · 2 críticos sem nível" e as portas Diagnosticar, Preparar e Configurações';

// The catalyst opening on a project, as the top of a product shows it working: the video, in a loop with no sound, in the window of
// a terminal. The video is its own pause, with no button over it: a click, a tap, the space or the enter on it stops the motion of
// the whole top, the video and the word that changes, and starts it again, since neither stops by itself (WCAG 2.2.2). With reduced
// motion, only its poster.
export function ToolVideo({ stopped, onToggle, className }: { stopped: boolean; onToggle: () => void; className?: string }) {
  const [still] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const video = useRef<HTMLVideoElement>(null);
  const { webm, mp4, poster, width, height } = CASA_VIDEO;
  const frame = "block h-auto w-full";

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    if (stopped) element.pause();
    // The browser may refuse to play, as with the power saving of iOS: the poster stays, and the page goes on without the motion.
    else void element.play().catch(() => undefined);
  }, [stopped]);

  return (
    <figure
      aria-label={LABEL}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-terminal-border bg-terminal shadow-xl",
        "has-[button:focus-visible]:outline-2 has-[button:focus-visible]:outline-offset-4 has-[button:focus-visible]:outline-ring",
        className,
      )}
    >
      {still ? (
        <img src={poster} alt="" width={width} height={height} className={frame} />
      ) : (
        <button
          type="button"
          onClick={onToggle}
          aria-label={`Vídeo da casa do catalyst. Clique para ${stopped ? "retomar" : "pausar"}.`}
          className="block w-full cursor-pointer focus-visible:outline-none"
        >
          <video ref={video} autoPlay loop muted playsInline poster={poster} width={width} height={height} aria-hidden className={frame}>
            <source src={webm} type="video/webm" />
            <source src={mp4} type="video/mp4" />
          </video>
        </button>
      )}
    </figure>
  );
}
