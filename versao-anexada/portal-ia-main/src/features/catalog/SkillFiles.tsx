import { useState } from "react";
import { FileText } from "lucide-react";
import { Sheet } from "@/components/ui/sheet";
import type { Skill } from "@/data/types";
import { BINARY_EXTENSIONS } from "./binary-extensions";
import { SkillFileContent } from "./SkillFileContent";

export function SkillFiles({ skill }: { skill: Skill }) {
  const [open, setOpen] = useState<string | null>(null);
  const [shown, setShown] = useState<string | null>(null);
  if (open !== null && open !== shown) setShown(open);
  return (
    <>
      <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card font-mono text-caption">
        {skill.files.map((file) => (
          <li key={file}>
            <button
              type="button"
              onClick={() => setOpen(file)}
              aria-label={`${BINARY_EXTENSIONS.test(file) ? "Baixar" : "Ver"} ${file}`}
              className="group flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors duration-(--duration-fast) hover:bg-accent/60 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
            >
              <FileText strokeWidth={1.5} aria-hidden className="size-3.5 shrink-0 text-muted-foreground" />
              <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">
                {file.includes("/") && <span className="text-muted-foreground">{file.slice(0, file.lastIndexOf("/") + 1)}</span>}
                {file.slice(file.lastIndexOf("/") + 1)}
              </span>
              <span className="font-sans text-caption text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                {BINARY_EXTENSIONS.test(file) ? "Baixar" : "Ver"}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <Sheet open={open !== null} onClose={() => setOpen(null)} title={shown ?? ""} size="lg">
        {shown && <SkillFileContent key={shown} skill={skill} file={shown} />}
      </Sheet>
    </>
  );
}
