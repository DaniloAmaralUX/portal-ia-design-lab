import { outlineGroupLabel, outlineLink, outlineList, outlineNumber } from "@/components/outline-class";
import type { TocGroup } from "@/components/toc-groups";
import { cn } from "@/lib/utils";

export function Toc({ groups, active, onNavigate }: { groups: TocGroup[]; active: string | null; onNavigate?: () => void }) {
  const numbered = groups.some((group) => group.items.some((item) => item.number));
  return (
    <div className="space-y-6">
      {groups.map((group, i) => (
        <div key={group.label?.text ?? i}>
          {group.label?.id ? (
            <a
              href={`#${group.label.id}`}
              onClick={onNavigate}
              aria-current={group.label.id === active ? "true" : undefined}
              // The label the reading is on takes an underline as well as the colour: the colour alone, which the hover also uses,
              // would be the only cue of the current place.
              className={cn(outlineGroupLabel, "transition-colors hover:text-link", group.label.id === active && "text-link underline decoration-2 underline-offset-4")}
            >
              {group.label.text}
            </a>
          ) : (
            group.label && <p className={outlineGroupLabel}>{group.label.text}</p>
          )}
          {group.items.length > 0 && (
            <ol className={outlineList}>
              {group.items.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} onClick={onNavigate} aria-current={item.id === active ? "true" : undefined} className={outlineLink(item.id === active)}>
                    {numbered && <span className={outlineNumber}>{item.number}</span>}
                    <span className="min-w-0 flex-1">
                      {item.text}
                      {item.context && <span className="sr-only"> ({item.context})</span>}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          )}
        </div>
      ))}
    </div>
  );
}
