import { intervals } from "virtual:intervals";
import { intervalText } from "virtual:interval-text";
import type { Interval } from "./types";

export { intervals };

export function getInterval(slug: string): Interval | undefined {
  return intervals.find((i) => i.slug === slug);
}

// The text of one technical break, which comes with its page and not with the code of the site.
export async function loadIntervalText(slug: string): Promise<string> {
  const load = intervalText[slug];
  return load ? (await load()).source : "";
}
