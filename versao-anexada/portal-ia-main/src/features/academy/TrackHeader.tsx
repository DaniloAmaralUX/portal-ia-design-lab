import { AreaTitle } from "@/components/AreaTitle";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Crumb } from "@/components/Crumb";
import type { Role } from "@/data/roles";

export function TrackHeader({ role }: { role: Role }) {
  return (
    <>
      <Breadcrumbs
        items={[
          <Crumb key="a" to="/academy">
            Academy
          </Crumb>,
          <Crumb key="t" to="/academy" hash="trilhas">
            Trilhas por papel
          </Crumb>,
        ]}
      />
      <AreaTitle area={role.area}>{role.name}</AreaTitle>
      <p className="mt-3 max-w-xl text-lead leading-relaxed text-muted-foreground text-pretty">
        {role.audience} A trilha existe nas três plataformas; cada curso traz a classificação para o seu papel. Comece pelos{" "}
        <strong className="font-semibold text-foreground">essenciais</strong>, na ordem das etapas.
      </p>
    </>
  );
}
