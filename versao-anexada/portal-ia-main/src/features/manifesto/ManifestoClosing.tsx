import { AcademyEntryPoint } from "@/components/AcademyEntryPoint";
import { MethodEntryPoint } from "@/components/MethodEntryPoint";

export function ManifestoClosing() {
  return (
    <section aria-labelledby="por-onde-seguir" className="mt-20">
      <h2 id="por-onde-seguir" className="font-display text-heading font-bold">
        Por onde seguir
      </h2>
      <p className="mt-1 max-w-measure text-small text-muted-foreground text-pretty">
        A Academy ensina IA do zero, com uma trilha por papel, e o Método mostra como a Pitang trabalha com ela, do PBI ao código revisado.
      </p>
      <ul className="reveal-children mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AcademyEntryPoint />
        <MethodEntryPoint />
      </ul>
    </section>
  );
}
