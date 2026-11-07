import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { AcademyEntryPoint } from "@/components/AcademyEntryPoint";
import { entryLink, entryLinkSecondary } from "@/components/entry-point-class";
import { EntryPoint } from "@/components/EntryPoint";
import { MethodEntryPoint } from "@/components/MethodEntryPoint";
import { Container } from "@/components/ui/container";
import { catalogPlugins, catalogSkills } from "@/data/catalog-index";
import { SectionHeading } from "./SectionHeading";

export function EntryPoints() {
  return (
    <section className="mt-24 sm:mt-28" aria-labelledby="portas-title">
      <Container>
        <SectionHeading
          id="portas-title"
          title="Aprender, aplicar, usar e contribuir"
          description="A Academy ensina IA do zero, o Método mostra como a Pitang trabalha com ela, o Catálogo traz as skills que fazem o trabalho no Claude Code, e qualquer time pode trazer a sua."
        />
        <ul className="reveal-children mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AcademyEntryPoint />
          <MethodEntryPoint />
          <EntryPoint
            label="Usar"
            title="Catálogo"
            text={`${catalogSkills.length} skills em ${catalogPlugins.length} plugins. Ache pela tarefa, em português, ou pela sua área.`}
          >
            <Link to="/explorar" className={entryLink}>
              Explorar o catálogo
              <ArrowRight aria-hidden className="size-4" />
            </Link>
            <Link to="/primeiros-passos" className={entryLinkSecondary}>
              Primeiros passos
            </Link>
          </EntryPoint>
          <EntryPoint
            label="Contribuir"
            title="Crie a sua skill"
            text="Transforme a tarefa que o seu time repete em skill, no padrão da casa, com o teste com e sem ela antes do MR."
          >
            <Link to="/contribuir" className={entryLink}>
              Como contribuir
              <ArrowRight aria-hidden className="size-4" />
            </Link>
            <Link to="/contribuir" hash="pedir" className={entryLinkSecondary}>
              Pedir uma skill
            </Link>
          </EntryPoint>
        </ul>
      </Container>
    </section>
  );
}
