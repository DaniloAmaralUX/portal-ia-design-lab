import { SITE_NAME } from "@/shared/brand";

export const SITE_TITLE = `${SITE_NAME} · capacitação em IA, método e skills para o Claude Code`;

export function pageHead(title?: string, description?: string) {
  return {
    meta: [
      { title: title ? `${title} · ${SITE_NAME}` : SITE_TITLE },
      ...(description ? [{ name: "description", content: description }] : []),
    ],
  };
}

export function documentTitle(title: string): string {
  return `${title} · ${SITE_NAME}`;
}
