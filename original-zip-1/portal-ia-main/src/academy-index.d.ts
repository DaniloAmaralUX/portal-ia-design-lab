declare module "virtual:academy-index/mentions" {
  export type Mention = { guide: string; chapter: string | null; anchor: string | null; title: string; count: number };
  export const mentions: Record<string, Mention[]>;
  export const titles: Record<string, string>;
}

declare module "virtual:academy-index/documents" {
  export type AcademyDocument = {
    guide: string;
    chapter: string | null;
    anchor: string | null;
    title: string;
    text: string;
  };
  export const documents: AcademyDocument[];
}
