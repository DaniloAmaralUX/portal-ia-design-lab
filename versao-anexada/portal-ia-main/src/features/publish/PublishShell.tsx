import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { EmptyState } from "@/components/EmptyState";
import { Container } from "@/components/ui/container";
import { SkeletonText } from "@/components/ui/skeleton";
import { useCanPublish } from "./use-can-publish";

// The pages of /publicar open only for the people of PUBLISHER_EMAILS. The list lives in the BFF, and the page only follows the
// canPublish of /api/me: the code of every page is in the one file of the site, so hiding the form is not what protects it.
export function PublishShell({ title, lead, children }: { title: string; lead: ReactNode; children: ReactNode }) {
  const access = useCanPublish();
  return (
    <Container className="pb-16 pt-10 sm:pt-14">
      <div className="max-w-3xl">
        <p className="eyebrow">Academy · publicar</p>
        <h1 className="mt-3 font-display text-title font-extrabold text-balance">{title}</h1>
        {access === "allowed" && <div className="mt-4 max-w-xl text-lead leading-relaxed text-muted-foreground text-pretty">{lead}</div>}
        <div className="mt-10">
          {access === "checking" && <SkeletonText lines={6} />}
          {access === "denied" && (
            <EmptyState
              title="Esta página é de quem publica no Academy"
              description={
                <>
                  Quem publica intervalos técnicos e treinamentos está numa lista do portal. Para entrar nela, fale com o Pitang Labs: o{" "}
                  <Link to="/manifesto" className="link">
                    manifesto
                  </Link>{" "}
                  mostra como.
                </>
              }
            >
              <Link to="/academy/intervalos" className="text-small link">
                Ver os intervalos técnicos
              </Link>
            </EmptyState>
          )}
          {access === "allowed" && children}
        </div>
      </div>
    </Container>
  );
}
