declare module "virtual:catalog-index" {
  import type { CatalogIndex } from "@/data/types";

  export const catalogIndex: CatalogIndex;
}

declare module "virtual:catalog" {
  import type { Release } from "@/data/types";

  export const release: Omit<Release, "changelog" | "plugins"> & { plugins: Omit<Release["plugins"][number], "files">[] };
}

declare module "virtual:changelog" {
  const text: string;
  export default text;
}

declare module "virtual:skill-docs" {
  export const skillDocs: Record<string, () => Promise<{ default: { frontmatter: string; body: string } }>>;
}
