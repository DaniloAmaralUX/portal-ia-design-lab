import { DisclosureSummary } from "@/components/ui/disclosure";
import { faq } from "./faq-items";

export function Faq() {
  return (
      <section className="mt-16" aria-labelledby="perguntas-frequentes">
        <h2 id="perguntas-frequentes" className="font-display text-heading font-bold">
          Perguntas frequentes
        </h2>
        <div className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
          {faq.map((item) => (
            <details key={item.q} className="group">
              <DisclosureSummary className="gap-4 px-5 py-4 text-subheading hover:bg-accent/50 focus-visible:-outline-offset-2">{item.q}</DisclosureSummary>
              <p className="max-w-measure px-5 pb-5 text-body leading-relaxed text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
  );
}
