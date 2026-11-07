import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";
import { imageSize } from "./image-size.ts";

const SIZES = "virtual:guide-image-sizes";

// The size of each figure of the guides, read from the file at the build, so the page can reserve its space before the figure comes.
// The key is the path the Markdown writes, relative to src/content/guides, like img/sdd-1.png.
export function guideImages(): Plugin {
  let folder = "";
  return {
    name: "pitang-guide-images",
    configResolved(config) {
      folder = path.join(config.root, "src/content/guides/img");
    },
    resolveId(id) {
      return id === SIZES ? `\0${id}` : undefined;
    },
    load(id) {
      if (id !== `\0${SIZES}`) return undefined;
      const sizes: Record<string, { width: number; height: number }> = {};
      for (const name of existsSync(folder) ? readdirSync(folder).sort() : []) {
        const file = path.join(folder, name);
        this.addWatchFile(file);
        const size = imageSize(readFileSync(file));
        if (size) sizes[`img/${name}`] = size;
        else this.warn(`The figure ${name} is not a PNG or a JPEG with a readable header, so it goes without width and height.`);
      }
      return `export const imageSizes = ${JSON.stringify(sizes)};\n`;
    },
  };
}
