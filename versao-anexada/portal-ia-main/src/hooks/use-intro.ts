import { useEffect } from "react";
import { writeStorage } from "@/lib/storage";
import { INTRO_SEEN_KEY } from "@/shared/intro";

export function useIntro() {
  useEffect(() => {
    writeStorage("sessionStorage", INTRO_SEEN_KEY, "1");
    const timer = window.setTimeout(() => {
      document.documentElement.dataset.introSeen = "";
    }, 1000);
    return () => window.clearTimeout(timer);
  }, []);
}
