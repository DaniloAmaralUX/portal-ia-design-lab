import { Check, Circle } from "lucide-react";
import { CodeBlock } from "@/components/CodeBlock";
import { plugins } from "@/data/catalog";
import { teamSettings } from "@/lib/commands";
import { iconHidden, iconShown, iconSwap, press } from "@/lib/motion";
import { cn, plural } from "@/lib/utils";

export function ProjectKit({ selected, onChange }: { selected: string[]; onChange: (list: string[]) => void }) {
  function toggle(name: string) {
    const list = selected.includes(name) ? selected.filter((n) => n !== name) : [...selected, name];
    onChange(plugins.map((p) => p.name).filter((n) => list.includes(n)));
  }
  return (
    <section id="kit" aria-labelledby="kit-title" className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <h2 id="kit-title" className="font-display text-heading font-bold">
        Montar o kit do projeto
      </h2>
      <p className="mt-2 max-w-measure text-small leading-relaxed text-muted-foreground">
        Marque os plugins que o time do projeto usa. O trecho vai no <code className="font-mono text-foreground">.claude/settings.json</code>, e
        cada colega recebe os plugins quando confia na pasta. A <code className="font-mono text-foreground">ref</code> fixa a versão.
      </p>
      <fieldset className="mt-5">
        <legend className="sr-only">Plugins do kit</legend>
        <div className="flex flex-wrap gap-2">
          {plugins.map((plugin) => {
            const checked = selected.includes(plugin.name);
            return (
              <label
                key={plugin.name}
                className={cn(
                  "inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border px-3 text-small font-medium has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring",
                  checked ? "border-foreground bg-foreground text-background" : "border-border bg-card text-foreground/80 hover:border-foreground/20",
                  press,
                )}
              >
                <input type="checkbox" checked={checked} onChange={() => toggle(plugin.name)} className="sr-only" />
                <span aria-hidden className="inline-grid size-3.5 shrink-0 place-items-center">
                  <Circle className={cn("col-start-1 row-start-1 size-3.5", iconSwap, checked ? iconHidden : iconShown)} />
                  <Check className={cn("col-start-1 row-start-1 size-3.5", iconSwap, checked ? iconShown : iconHidden)} />
                </span>
                {plugin.displayName}
              </label>
            );
          })}
        </div>
      </fieldset>
      <p role="status" className="sr-only">
        {selected.length ? `Trecho com ${plural(selected.length, "plugin", "plugins")}` : "Nenhum plugin marcado"}
      </p>
      <div className="mt-5">
        {selected.length ? (
          <CodeBlock code={teamSettings(selected)} language="json" message="Trecho copiado" />
        ) : (
          <p className="text-small text-muted-foreground">Marque ao menos um plugin para ver o trecho.</p>
        )}
      </div>
    </section>
  );
}
