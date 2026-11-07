import { slugify } from "../../lib/text.ts";
import type { Recording } from "../../shared/publish-files.ts";

// The checks and the files are in src/shared/publish-files.ts, which the BFF uses too. What stays here is only for the form. The
// imports are relative, with the extension, so scripts/publish-files.test.ts can read each file back with the parsers of the build.
export {
  checkCourse,
  checkInterval,
  checkRecording,
  courseFile,
  intervalFile,
  lessonFile,
  videoAddress,
  type CourseDraft,
  type GeneratedFile,
  type IntervalDraft,
  type Problems,
  type PublishRequest,
  type Recording,
} from "../../shared/publish-files.ts";

const MAX_SLUG = 60;

export const emptyRecording: Recording = { title: "", date: "", minutes: "", summary: "", video: "", text: "" };

// The address of the page, from the title: cut at a dash so a long title does not end the address mid-word.
export function slugFor(title: string): string {
  const slug = slugify(title);
  if (slug.length <= MAX_SLUG) return slug;
  const cut = slug.slice(0, MAX_SLUG + 1);
  return cut.slice(0, cut.lastIndexOf("-") > 0 ? cut.lastIndexOf("-") : MAX_SLUG);
}
