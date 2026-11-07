import { notFound } from "@tanstack/react-router";
import { loadGuide } from "@/data/guide-loader";
import { getGuide } from "@/data/guides";

export async function loadManifesto() {
  const guide = getGuide("manifesto");
  if (!guide) throw notFound();
  return { guide, doc: await loadGuide(guide.slug) };
}
