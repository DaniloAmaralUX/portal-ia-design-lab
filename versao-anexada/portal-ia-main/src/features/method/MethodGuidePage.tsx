import { Crumb } from "@/components/Crumb";
import { NextLink } from "@/components/NextLink";
import { PrevLink } from "@/components/PrevLink";
import { GUIDE_GROUPS, readingOrder, type Guide } from "@/data/guides";
import { GuideView } from "./GuideView";

export function MethodGuidePage({ guide, doc }: { guide: Guide; doc: string }) {
  const group = GUIDE_GROUPS.find((g) => g.id === guide.group);
  const i = readingOrder.findIndex((g) => g.slug === guide.slug);
  const prev = readingOrder[i - 1];
  const next = readingOrder[i + 1];
  return (
    <GuideView
      guide={guide}
      doc={doc}
      track={[
        <Crumb key="m" to="/metodo">
          Método
        </Crumb>,
        <span key="g">{group?.name}</span>,
      ]}
      next={
        next ? (
          <NextLink to="/metodo/$guide" params={{ guide: next.slug }} kicker="Próximo guia" label={next.label} />
        ) : (
          <NextLink to="/explorar" kicker="Você terminou os guias do Método. Próximo" label="Ache a skill que resolve o seu caso, no Catálogo" />
        )
      }
      prev={
        prev ? (
          <PrevLink to="/metodo/$guide" params={{ guide: prev.slug }} kicker="Guia anterior" label={prev.label} />
        ) : (
          <PrevLink to="/metodo" activeOptions={{ exact: true }} kicker="Método" label="Visão geral" />
        )
      }
    />
  );
}
