import { INTRO_SEEN_KEY } from "../shared/intro.ts";
import { THEME_KEY } from "../shared/theme.ts";

export const BEFORE_PAINT_SCRIPT = `(function () {
  var html = document.documentElement;
  var dark;
  try {
    var saved = localStorage.getItem(${JSON.stringify(THEME_KEY)});
    dark = saved ? saved === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  } catch (e) {
    dark = matchMedia("(prefers-color-scheme: dark)").matches;
  }
  html.classList.toggle("dark", dark);
  if (/Mac|iPhone|iPad/.test(navigator.userAgent)) html.dataset.platform = "mac";
  try {
    if (sessionStorage.getItem(${JSON.stringify(INTRO_SEEN_KEY)})) html.dataset.introSeen = "";
  } catch (e) {}
})();`;
