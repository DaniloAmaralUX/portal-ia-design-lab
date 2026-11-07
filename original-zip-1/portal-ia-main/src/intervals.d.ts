declare module "virtual:intervals" {
  import type { Interval } from "@/data/types";

  export const intervals: Interval[];
}

declare module "virtual:interval-text" {
  export const intervalText: Record<string, () => Promise<{ source: string }>>;
}
