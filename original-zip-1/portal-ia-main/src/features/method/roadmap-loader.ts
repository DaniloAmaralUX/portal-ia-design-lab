import { notFound } from "@tanstack/react-router";
import { roadmapFor } from "@/data/roadmaps";

export function loadRoadmap(area: string) {
  const roadmap = roadmapFor(area);
  if (!roadmap) throw notFound();
  return { roadmap };
}
