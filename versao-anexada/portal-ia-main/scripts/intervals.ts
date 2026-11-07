import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";
import { areas } from "../src/data/areas.ts";
import type { AreaId, Interval } from "../src/data/types.ts";
import { buildConfig } from "./build-config.ts";

const INDEX = "virtual:intervals";
const TEXT = "virtual:interval-text";
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const FIELDS = ["title", "date", "minutes", "area", "summary", "video"] as const;
const AREA_IDS: readonly string[] = areas.map((a) => a.id);

type Parsed = { interval: Interval; text: string };

function headOf(file: string, source: string): { head: Record<string, string>; text: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(source);
  if (!match) throw new Error(`${file}: the file must start with the head between two --- lines.`);
  const head: Record<string, string> = {};
  for (const line of (match[1] ?? "").split(/\r?\n/)) {
    if (!line.trim()) continue;
    const field = /^([a-z]+):\s*(.*)$/.exec(line);
    if (!field) throw new Error(`${file}: "${line}" is not a field of the head, like title: Revisão de PR.`);
    const [, name = "", raw = ""] = field;
    if (!(FIELDS as readonly string[]).includes(name)) throw new Error(`${file}: the head has no field ${name}. The fields are ${FIELDS.join(", ")}.`);
    if (name in head) throw new Error(`${file}: the field ${name} repeats.`);
    head[name] = raw.trim().replace(/^"(.*)"$/, "$1");
  }
  return { head, text: (match[2] ?? "").trim() };
}

// The recording plays in the iframe the policy allows, so it has to be a page of the SharePoint of SHAREPOINT_ORIGIN. Without the
// origin there is no iframe to play it in, and the build stops instead of publishing a break with no video.
function videoOf(file: string, value: string, sharepointOrigin: string | null): string {
  if (!sharepointOrigin) {
    throw new Error(
      `${file}: the recording plays from SharePoint, and SHAREPOINT_ORIGIN is missing. Put the origin of the recording in the .env, like SHAREPOINT_ORIGIN=https://empresa.sharepoint.com (see .env.example).`,
    );
  }
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${file}: video must be the address of the recording, the src of the embed code of Stream. Got "${value}".`);
  }
  if (url.protocol !== "https:" || !url.hostname.endsWith(".sharepoint.com")) throw new Error(`${file}: video must be an https address of SharePoint.`);
  if (url.origin !== sharepointOrigin) throw new Error(`${file}: video must be in ${sharepointOrigin}, the SHAREPOINT_ORIGIN. Got ${url.origin}.`);
  return url.href;
}

export function parseInterval(file: string, source: string, sharepointOrigin: string | null): Parsed {
  const slug = path.basename(file, ".md");
  if (!SLUG.test(slug)) throw new Error(`${file}: the name of the file is the address of the page, in lowercase letters, digits and dashes.`);
  const { head, text } = headOf(file, source);
  for (const name of ["title", "date", "summary", "video"]) if (!head[name]) throw new Error(`${file}: the head is missing ${name}.`);
  const date = head.date ?? "";
  if (!DATE.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00Z`))) throw new Error(`${file}: date must be a day like 2026-10-15. Got "${date}".`);
  const minutes = head.minutes ? Number(head.minutes) : null;
  if (minutes !== null && (!Number.isInteger(minutes) || minutes < 1)) throw new Error(`${file}: minutes must be the whole minutes of the recording, like 42. Got "${head.minutes}".`);
  const area = head.area || null;
  if (area !== null && !AREA_IDS.includes(area)) throw new Error(`${file}: area must be one of ${AREA_IDS.join(", ")}, or left out for every area. Got "${area}".`);
  if (!text) throw new Error(`${file}: the text that explains the break goes under the head, and it is empty.`);
  return {
    interval: {
      slug,
      title: head.title ?? "",
      date,
      minutes,
      area: area as AreaId | null,
      summary: head.summary ?? "",
      video: videoOf(file, head.video ?? "", sharepointOrigin),
    },
    text,
  };
}

// The site gets the list of the breaks without their text, newest first, and the text of one break when its page opens. Adding a
// break is adding a file to the folder.
export function intervals(options: { sharepointOrigin?: string | null } = {}): Plugin {
  let folder = "";
  const read = (): Parsed[] => {
    if (!existsSync(folder)) return [];
    const sharepointOrigin = options.sharepointOrigin === undefined ? buildConfig().sharepointOrigin : options.sharepointOrigin;
    return readdirSync(folder)
      .filter((name) => name.endsWith(".md"))
      .map((name) => parseInterval(`src/content/intervals/${name}`, readFileSync(path.join(folder, name), "utf8"), sharepointOrigin))
      .sort((a, b) => b.interval.date.localeCompare(a.interval.date) || a.interval.title.localeCompare(b.interval.title));
  };

  return {
    name: "pitang-intervals",
    configResolved(config) {
      folder = path.join(config.root, "src/content/intervals");
    },
    // addWatchFile takes files, not folders: the dev server reads a watched path as an import, and a folder cannot be imported. A break
    // added or removed is a change to the folder, so the dev server's own watcher drops the list and reloads the page.
    configureServer(server) {
      server.watcher.add(folder);
      const refresh = (file: string) => {
        if (path.resolve(path.dirname(file)) !== path.resolve(folder) || !file.endsWith(".md")) return;
        for (const id of [`\0${INDEX}`, `\0${TEXT}`]) {
          const module = server.moduleGraph.getModuleById(id);
          if (module) server.moduleGraph.invalidateModule(module);
        }
        server.ws.send({ type: "full-reload" });
      };
      server.watcher.on("add", refresh);
      server.watcher.on("unlink", refresh);
    },
    resolveId(id) {
      return id === INDEX || id === TEXT || id.startsWith(`${TEXT}/`) ? `\0${id}` : undefined;
    },
    load(id) {
      if (!id.startsWith(`\0${INDEX}`) && !id.startsWith(`\0${TEXT}`)) return undefined;
      const all = read();
      for (const { interval } of all) this.addWatchFile(path.join(folder, `${interval.slug}.md`));
      if (id === `\0${INDEX}`) {
        return `export const intervals = ${JSON.stringify(all.map((p) => p.interval))};\n`;
      }
      if (id === `\0${TEXT}`) {
        const entries = all.map(({ interval }) => `  ${JSON.stringify(interval.slug)}: () => import(${JSON.stringify(`${TEXT}/${interval.slug}`)}),`);
        return `export const intervalText = {\n${entries.join("\n")}\n};\n`;
      }
      const slug = id.slice(`\0${TEXT}/`.length);
      const found = all.find((p) => p.interval.slug === slug);
      if (!found) throw new Error(`There is no technical break called ${slug}.`);
      return `export const source = ${JSON.stringify(found.text)};\n`;
    },
  };
}
