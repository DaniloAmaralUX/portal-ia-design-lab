import sizes from "virtual:downloads";
import type { Plugin, Skill } from "@/data/types";
import { zipName } from "@/shared/zip-name";

export type Download = { name: string; url: string; size: number };

function download(name: string): Download {
  return { name, url: `${import.meta.env.BASE_URL}downloads/${name}`, size: sizes[name] ?? 0 };
}

export function pluginZip(plugin: Plugin): Download {
  return download(zipName(plugin.name, plugin.version));
}

export function skillZip(skill: Skill, plugin: Plugin): Download {
  return download(zipName(skill.slug, plugin.version));
}

export function formatSize(bytes: number): string {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} MB`;
  return `${Math.max(1, Math.round(bytes / 1000))} kB`;
}
