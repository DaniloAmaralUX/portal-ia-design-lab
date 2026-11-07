import { Link, useRouter } from "@tanstack/react-router";
import { ErrorPage } from "@/components/ErrorPage";
import { Button } from "@/components/ui/button";

export function RouteError({ reset }: { reset: () => void }) {
  const router = useRouter();
  return (
    <ErrorPage kind="failed" heading="Esta página não carregou." title="A página não carregou" text="Tente de novo. Se continuar, volte para o início e abra a página por lá.">
      <div className="mt-8 flex flex-wrap gap-3">
        <Button
          onClick={() => {
            reset();
            void router.invalidate();
          }}
        >
          Tentar de novo
        </Button>
        <Button asChild variant="outline">
          <Link to="/">Ir para o início</Link>
        </Button>
      </div>
    </ErrorPage>
  );
}
