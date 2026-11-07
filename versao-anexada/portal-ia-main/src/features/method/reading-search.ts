// The reading mode is part of the page address, so a link opens the presentation on the slide the person shared. This file
// imports nothing, because the route reads it on every page, to validate the address.
export const PRESENTING = "apresentacao";

// The last slide, where the step back from the next chapter lands; its number is known once the slides are laid out.
export const LAST_SLIDE = "ultimo";

export type ReadingSearch = { modo?: typeof PRESENTING; slide?: number | typeof LAST_SLIDE };

export function validateReadingSearch(search: Record<string, unknown>): ReadingSearch {
  if (search.modo !== PRESENTING) return { modo: undefined, slide: undefined };
  if (search.slide === LAST_SLIDE) return { modo: PRESENTING, slide: LAST_SLIDE };
  const slide = Number(search.slide);
  return { modo: PRESENTING, slide: Number.isInteger(slide) && slide > 0 ? slide : undefined };
}
