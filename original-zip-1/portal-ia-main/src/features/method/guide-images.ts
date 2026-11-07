import { imageSizes } from "virtual:guide-image-sizes";

const images = import.meta.glob<string>("../../content/guides/img/*", { eager: true, query: "?url", import: "default" });

// The address of a figure of a guide, written in the Markdown as a path inside src/content/guides.
export function guideImage(src: string): string {
  return images[`../../content/guides/${src}`] ?? src;
}

// The size the build read from the figure, or undefined for an address that is not one of the figures.
export function guideImageSize(src: string): { width: number; height: number } | undefined {
  return Object.hasOwn(imageSizes, src) ? imageSizes[src] : undefined;
}
