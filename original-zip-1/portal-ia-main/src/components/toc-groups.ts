// The context is said only to the screen reader, after the text, where the same text repeats in other groups: the phases of each
// platform of a track, which would read as three links "Fundamentos" to three places.
export type TocItem = { id: string; number?: string; text: string; context?: string };

// A group of the outline: an optional label, which links to its section when it has an id, and the items under it.
export type TocGroup = { label?: { text: string; id?: string }; items: TocItem[] };

// The ids the outline points to, in the order of the page, for the scroll spy.
export function tocIds(groups: TocGroup[]): string[] {
  return groups.flatMap((group) => [...(group.label?.id ? [group.label.id] : []), ...group.items.map((item) => item.id)]);
}
