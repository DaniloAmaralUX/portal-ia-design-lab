import { Link } from "@tanstack/react-router";
import { ArrowRight, Search } from "lucide-react";
import { ErrorPage } from "@/components/ErrorPage";
import { Button } from "@/components/ui/button";
import { useUi } from "@/store/ui";

export function NotFoundPage() {
  const openSearch = useUi((s) => s.setPaletteOpen);
  return (
    <ErrorPage
      kind="not-found"
      heading="Esta página não existe, ou mudou de lugar."
      title="Página não encontrada"
      text="Pode ser um link antigo de trilha, de guia ou de skill. Busque o que você procurava, ou abra a seção dele."
    >
      <div className="mt-8 flex flex-wrap gap-3">
        <Button onClick={() => openSearch(true)}>
          <Search data-icon="inline-start" />
          Buscar no site
        </Button>
        <Button asChild variant="outline">
          <Link to="/">Ir para o início</Link>
        </Button>
      </div>
      <ul aria-label="Seções do site" className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-small">
        <li>
          <Link to="/academy" className="inline-flex items-center gap-1.5 font-semibold link-text">
            Abrir a Academy
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </li>
        <li>
          <Link to="/metodo" className="inline-flex items-center gap-1.5 font-semibold link-text">
            Abrir o Método
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </li>
        <li>
          <Link to="/explorar" className="inline-flex items-center gap-1.5 font-semibold link-text">
            Explorar o catálogo
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </li>
      </ul>
    </ErrorPage>
  );
}
