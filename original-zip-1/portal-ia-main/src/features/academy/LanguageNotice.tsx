import { Link } from "@tanstack/react-router";
import { Languages } from "lucide-react";
import { Notice } from "@/components/Notice";

export function LanguageNotice({ className }: { className?: string }) {
  return (
    <Notice icon={Languages} className={className}>
      <p className="max-w-measure text-pretty">
        <strong className="font-semibold text-foreground">Os cursos são, em geral, em inglês.</strong> Dá para ligar legenda em português
        nos vídeos e traduzir a página inteira no navegador.{" "}
        <Link to="/academy/em-portugues" className="link">
          Veja como estudar em português
        </Link>
        .
      </p>
    </Notice>
  );
}
