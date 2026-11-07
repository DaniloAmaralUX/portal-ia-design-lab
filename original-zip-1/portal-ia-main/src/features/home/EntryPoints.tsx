import { Link } from "@tanstack/react-router";
import { ArrowRight, Blocks, Lightbulb } from "lucide-react";
import { AcademyEntryPoint } from "@/components/AcademyEntryPoint";
import { entryLink, entryLinkSecondary } from "@/components/entry-point-class";
import { EntryPoint } from "@/components/EntryPoint";
import { MethodEntryPoint } from "@/components/MethodEntryPoint";
import { Container } from "@/components/ui/container";
import { catalogPlugins, catalogSkills } from "@/data/catalog-index";
import { SectionHeading } from "./SectionHeading";

export function EntryPoints() {
  return (
    <section className="mt-14 sm:mt-16" aria-labelledby="portas-title">
      <Container>
        <SectionHeading
          id="portas-title"
          title="O que você quer fazer?"
          description="Escolha o conteúdo de acordo com a sua tarefa de hoje."
        />
        <ul className="reveal-children mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <AcademyEntryPoint />
          <MethodEntryPoint />
          <EntryPoint
            icon={Blocks}
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
            icon={Lightbulb}
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
