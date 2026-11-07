declare module "virtual:guide-index" {
  import type { ChapterMeta } from "@/lib/guide-text";

  export type GuideIndex = { chapters: ChapterMeta[]; anchors: Record<string, string> };
  export const guideIndex: Record<string, GuideIndex>;
}

declare module "virtual:guide-text" {
  export const guideText: Record<string, () => Promise<{ source: string; title: string }>>;
}

declare module "virtual:guide-image-sizes" {
  export const imageSizes: Record<string, { width: number; height: number }>;
}
