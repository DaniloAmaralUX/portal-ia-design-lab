// The text without accents and in lower case, so the search and the anchors treat "Atenção" and "atencao" as one.
export function fold(text: string): string {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

export function slugify(text: string): string {
  return fold(text).replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
