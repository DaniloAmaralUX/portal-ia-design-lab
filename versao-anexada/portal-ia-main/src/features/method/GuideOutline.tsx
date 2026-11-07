import { Link } from "@tanstack/react-router";
import { outlineGroupLabel, outlineLink, outlineList, outlineNumber, outlineSubLink, outlineSubNumber } from "@/components/outline-class";
import { ReadMark } from "@/components/ReadMark";
import { Toc } from "@/components/Toc";
import type { Guide } from "@/data/guides";
import { useReadChapters } from "@/hooks/use-read-chapters";
import { partsOf, type ChapterMeta, type OutlineItem } from "@/lib/guide-text";
import { useUi } from "@/store/ui";
import { guideTarget } from "./guide-target";
import { useGuideOutline } from "./use-guide-outline";

// The outline of the open guide: in the column on the right from 1280px, under the guide in the menu below it, where the menu of the
// drawer closes on onNavigate.
export function GuideOutline({ onNavigate }: { onNavigate?: () => void }) {
  const { guide, chapters, current, sections, items } = useGuideOutline();
  const active = useUi((s) => s.activeSection);
  if (!guide) return null;
  if (!chapters) return items.length ? <Toc groups={[{ items }]} active={active} onNavigate={onNavigate} /> : null;
  return <Chapters guide={guide} chapters={chapters} current={current} sections={sections} active={active} onNavigate={onNavigate} />;
}

function Chapters({
  guide,
  chapters,
  current,
  sections,
  active,
  onNavigate,
}: {
  guide: Guide;
  chapters: ChapterMeta[];
  current?: string;
  sections: OutlineItem[];
  active: string | null;
  onNavigate?: () => void;
}) {
  const { readIds } = useReadChapters();
  const inSection = sections.some((s) => s.id === active);
  const numbered = chapters.some((c) => c.number);
  const sectionsNumbered = sections.some((s) => s.number);
  return (
    <div className="space-y-6">
      {partsOf(chapters).map(({ part, chapters: list }, i) => (
        <div key={`${part}-${i}`}>
          {part && <p className={outlineGroupLabel}>{part}</p>}
          <ol className={outlineList}>
            {list.map((c) => {
              const here = c.id === current;
              return (
                <li key={c.id}>
                  <Link
                    {...guideTarget({ guide: guide.slug, chapter: c.id })}
                    onClick={onNavigate}
                    aria-current={here ? "page" : undefined}
                    className={outlineLink(here, here && !inSection)}
                  >
                    {numbered && <span className={outlineNumber}>{c.number}</span>}
                    <span className="min-w-0 flex-1">{c.title}</span>
                    {readIds.has(`${guide.slug}/${c.id}`) && <ReadMark />}
                  </Link>
                  {here && sections.length > 0 && (
                    <ol aria-label={`Seções de ${c.title}`} className="pb-1.5">
                      {sections.map((s) => (
                        <li key={s.id}>
                          <a href={`#${s.id}`} onClick={onNavigate} aria-current={s.id === active ? "true" : undefined} className={outlineSubLink(s.id === active)}>
                            {sectionsNumbered && <span className={outlineSubNumber}>{s.number}</span>}
                            <span className="min-w-0 flex-1">{s.text}</span>
                          </a>
                        </li>
                      ))}
                    </ol>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      ))}
    </div>
  );
}
