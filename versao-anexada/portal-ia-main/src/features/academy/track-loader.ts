import { notFound } from "@tanstack/react-router";
import { roleFor } from "@/data/roles";

export function loadTrack(area: string) {
  const role = roleFor(area);
  if (!role) throw notFound();
  return { role };
}
