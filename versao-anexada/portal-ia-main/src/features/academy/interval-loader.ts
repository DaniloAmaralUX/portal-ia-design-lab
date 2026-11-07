import { notFound } from "@tanstack/react-router";
import { getInterval, loadIntervalText } from "@/data/intervals";

export async function loadInterval(slug: string) {
  const interval = getInterval(slug);
  if (!interval) throw notFound();
  return { interval, text: await loadIntervalText(slug) };
}
